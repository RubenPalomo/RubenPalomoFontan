import { createHash, randomBytes } from "node:crypto";
import type { Collection, ObjectId, WithId } from "mongodb";

import { getMongoClient } from "@/lib/mongodb";

const DATABASE_NAME = "ruben_palomo";
const COLLECTION_NAME = "newsletter_subscribers";
const CONFIRMATION_VALIDITY_MS = 48 * 60 * 60 * 1_000;

export type NewsletterSubscriber = {
  name: string;
  email: string;
  company: string | null;
  source: string | null;
  consent: boolean;
  consentRequestedAt?: Date;
  consentAt: Date | null;
  confirmedAt: Date | null;
  confirmationTokenHash: string;
  confirmationExpiresAt?: Date;
  confirmationEmailStatus?: "pending" | "sent" | "failed";
  confirmationEmailSentAt?: Date | null;
  confirmationEmailFailedAt?: Date | null;
  notificationSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateNewsletterSubscriptionInput = {
  name: string;
  email: string;
  company: string;
  source: string;
};

export type NewsletterConfirmationResult =
  | { status: "confirmed"; subscriber: WithId<NewsletterSubscriber> }
  | { status: "already-confirmed" | "expired" | "invalid" };

let collectionPromise: Promise<Collection<NewsletterSubscriber>> | undefined;

function hashConfirmationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getNewsletterCollection() {
  collectionPromise ??= getMongoClient()
    .then(async (client) => {
      const collection = client.db(DATABASE_NAME).collection<NewsletterSubscriber>(COLLECTION_NAME);

      await Promise.all([
        collection.createIndex({ email: 1 }, { unique: true, name: "newsletter_email_unique" }),
        collection.createIndex(
          { confirmationTokenHash: 1 },
          { unique: true, sparse: true, name: "newsletter_confirmation_token_unique" }
        ),
        collection.createIndex(
          { confirmationExpiresAt: 1 },
          { expireAfterSeconds: 0, name: "newsletter_confirmation_expiry" }
        ),
      ]);

      return collection;
    })
    .catch((error: unknown) => {
      collectionPromise = undefined;
      throw error;
    });

  return collectionPromise;
}

export async function createNewsletterSubscription(input: CreateNewsletterSubscriptionInput) {
  const requestedAt = new Date();
  const confirmationToken = randomBytes(32).toString("hex");
  const confirmationTokenHash = hashConfirmationToken(confirmationToken);
  const confirmationExpiresAt = new Date(requestedAt.getTime() + CONFIRMATION_VALIDITY_MS);
  const collection = await getNewsletterCollection();
  const result = await collection.updateOne(
    { email: input.email },
    {
      $setOnInsert: {
        name: input.name,
        email: input.email,
        company: input.company || null,
        source: input.source || null,
        consent: false,
        consentRequestedAt: requestedAt,
        consentAt: null,
        confirmedAt: null,
        confirmationTokenHash,
        confirmationExpiresAt,
        confirmationEmailStatus: "pending",
        confirmationEmailSentAt: null,
        confirmationEmailFailedAt: null,
        notificationSentAt: null,
        createdAt: requestedAt,
        updatedAt: requestedAt,
      },
    },
    { upsert: true }
  );

  return {
    created: result.upsertedCount === 1,
    confirmationToken,
    confirmationTokenHash,
    confirmationExpiresAt,
  };
}

export async function markNewsletterConfirmationEmailSent(email: string, confirmationTokenHash: string) {
  const collection = await getNewsletterCollection();
  const sentAt = new Date();
  await collection.updateOne(
    { email, confirmationTokenHash, confirmedAt: null },
    {
      $set: {
        confirmationEmailStatus: "sent",
        confirmationEmailSentAt: sentAt,
        updatedAt: sentAt,
      },
    }
  );
}

export async function markNewsletterConfirmationEmailFailed(email: string, confirmationTokenHash: string) {
  const collection = await getNewsletterCollection();
  const failedAt = new Date();
  await collection.updateOne(
    { email, confirmationTokenHash, confirmedAt: null },
    {
      $set: {
        confirmationEmailStatus: "failed",
        confirmationEmailFailedAt: failedAt,
        updatedAt: failedAt,
      },
      $unset: { confirmationExpiresAt: "" },
    }
  );
}

export async function confirmNewsletterSubscription(token: string): Promise<NewsletterConfirmationResult> {
  if (!/^[a-f0-9]{64}$/i.test(token)) return { status: "invalid" };

  const now = new Date();
  const confirmationTokenHash = hashConfirmationToken(token);
  const collection = await getNewsletterCollection();
  const subscriber = await collection.findOneAndUpdate(
    {
      confirmationTokenHash,
      confirmedAt: null,
      confirmationExpiresAt: { $gt: now },
    },
    {
      $set: {
        consent: true,
        consentAt: now,
        confirmedAt: now,
        updatedAt: now,
      },
      $unset: { confirmationExpiresAt: "" },
    },
    { returnDocument: "after" }
  );

  if (subscriber) return { status: "confirmed", subscriber };

  const existingSubscriber = await collection.findOne(
    { confirmationTokenHash },
    { projection: { confirmedAt: 1, confirmationExpiresAt: 1 } }
  );

  if (!existingSubscriber) return { status: "invalid" };
  if (existingSubscriber.confirmedAt) return { status: "already-confirmed" };
  return { status: "expired" };
}

export async function markNewsletterNotificationSent(id: ObjectId) {
  const collection = await getNewsletterCollection();
  await collection.updateOne({ _id: id, notificationSentAt: null }, { $set: { notificationSentAt: new Date() } });
}
