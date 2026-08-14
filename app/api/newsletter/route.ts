import type { Collection } from "mongodb";

import { getMongoClient } from "@/lib/mongodb";

const MAX_REQUEST_BYTES = 10_000;
const DATABASE_NAME = "ruben_palomo";
const COLLECTION_NAME = "newsletter_subscribers";

type NewsletterPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  consent?: unknown;
  source?: unknown;
};

type NewsletterSubscriber = {
  name: string;
  email: string;
  company: string | null;
  source: string | null;
  consent: true;
  consentAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

let collectionPromise: Promise<Collection<NewsletterSubscriber>> | undefined;

function getNewsletterCollection() {
  collectionPromise ??= getMongoClient()
    .then(async (client) => {
      const collection = client.db(DATABASE_NAME).collection<NewsletterSubscriber>(COLLECTION_NAME);

      await collection.createIndex({ email: 1 }, { unique: true, name: "newsletter_email_unique" });

      return collection;
    })
    .catch((error: unknown) => {
      collectionPromise = undefined;
      throw error;
    });

  return collectionPromise;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json({ ok: false, error: "Request too large" }, { status: 413 });
  }

  let payload: NewsletterPayload;
  try {
    const parsedPayload: unknown = await request.json();
    if (!parsedPayload || typeof parsedPayload !== "object" || Array.isArray(parsedPayload)) {
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    payload = parsedPayload as NewsletterPayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = cleanText(payload.name, 120);
  const email = cleanText(payload.email, 254).toLowerCase();
  const company = cleanText(payload.company, 160);
  const source = cleanText(payload.source, 500);
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !hasValidEmail || payload.consent !== true) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const collection = await getNewsletterCollection();
    const now = new Date();
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          name,
          email,
          company: company || null,
          source: source || null,
          consent: true,
          consentAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    return Response.json({ ok: true, created: result.upsertedCount === 1 });
  } catch (error) {
    console.error("[newsletter] MongoDB persistence failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, error: "Newsletter persistence failed" }, { status: 503 });
  }
}
