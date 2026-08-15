import EmailConfirmarSuscripcionNewsletter, {
  getEmailConfirmarSuscripcionNewsletterText,
} from "@/emails/EmailConfirmarSuscripcionNewsletter";
import {
  createNewsletterSubscription,
  markNewsletterConfirmationEmailFailed,
  markNewsletterConfirmationEmailSent,
  markNewsletterConfirmationEmailSentToOwner,
} from "@/lib/newsletter";
import { getNewsletterFallbackEmailConfig, getNotificationEmailConfig, getResendClient } from "@/lib/resend";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 10_000;
type NewsletterPayload = {
  submissionId?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  consent?: unknown;
  source?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

type ConfirmationEmailProps = {
  name: string;
  confirmationUrl: string;
  expiresAt: string;
};

async function preserveSubscriptionAfterEmailFailure(email: string, confirmationTokenHash: string) {
  try {
    await markNewsletterConfirmationEmailFailed(email, confirmationTokenHash);
  } catch (error) {
    console.error("[newsletter] Failed to record the Resend error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function sendConfirmationEmailToOwner({
  email,
  submissionId,
  confirmationTokenHash,
  emailProps,
}: {
  email: string;
  submissionId: string;
  confirmationTokenHash: string;
  emailProps: ConfirmationEmailProps;
}) {
  try {
    const resend = getResendClient();
    const { from, to } = getNewsletterFallbackEmailConfig();
    const { error } = await resend.emails.send(
      {
        from,
        to,
        replyTo: email,
        subject: `Reenviar a ${email} — Confirma tu suscripción a la newsletter`,
        react: EmailConfirmarSuscripcionNewsletter(emailProps),
        text: getEmailConfirmarSuscripcionNewsletterText(emailProps),
      },
      { idempotencyKey: `newsletter-confirmation-fallback/${submissionId}` }
    );

    if (error) {
      console.error("[newsletter] Resend fallback delivery failed", { error: error.message });
      await preserveSubscriptionAfterEmailFailure(email, confirmationTokenHash);
      return false;
    }

    try {
      await markNewsletterConfirmationEmailSentToOwner(email, confirmationTokenHash);
    } catch (error) {
      console.error("[newsletter] Failed to record fallback email delivery", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return true;
  } catch (error) {
    console.error("[newsletter] Resend fallback service failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    await preserveSubscriptionAfterEmailFailure(email, confirmationTokenHash);
    return false;
  }
}

function getStoredSubscriptionResponse(confirmationFallbackSent: boolean) {
  return Response.json({
    ok: true,
    created: true,
    alreadySubscribed: false,
    confirmationEmailSent: false,
    confirmationFallbackSent,
    storedWithoutEmail: !confirmationFallbackSent,
  });
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
  const submissionId = cleanText(payload.submissionId, 64);
  const email = cleanText(payload.email, 254).toLowerCase();
  const company = cleanText(payload.company, 160);
  const source = cleanText(payload.source, 500);
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasValidSubmissionId = /^[a-z0-9-]{16,64}$/i.test(submissionId);

  if (!hasValidSubmissionId || !name || !hasValidEmail || payload.consent !== true) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  let subscription: Awaited<ReturnType<typeof createNewsletterSubscription>>;

  try {
    subscription = await createNewsletterSubscription({ name, email, company, source });
  } catch (error) {
    console.error("[newsletter] MongoDB persistence failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, error: "Newsletter persistence failed" }, { status: 503 });
  }

  if (!subscription.created) {
    return Response.json({ ok: true, created: false, alreadySubscribed: true });
  }

  let emailProps: ConfirmationEmailProps;
  try {
    const confirmationUrl = new URL("/api/newsletter/confirm", siteUrl);
    if (process.env.NODE_ENV === "production" && confirmationUrl.protocol !== "https:") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
    }
    confirmationUrl.searchParams.set("token", subscription.confirmationToken);

    emailProps = {
      name,
      confirmationUrl: confirmationUrl.toString(),
      expiresAt: subscription.confirmationExpiresAt.toISOString(),
    };
  } catch (error) {
    console.error("[newsletter] Confirmation URL creation failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    await preserveSubscriptionAfterEmailFailure(email, subscription.confirmationTokenHash);
    return getStoredSubscriptionResponse(false);
  }

  try {
    const resend = getResendClient();
    const { from, to: replyTo } = getNotificationEmailConfig();
    const { error } = await resend.emails.send(
      {
        from,
        to: email,
        replyTo,
        subject: "Confirma tu suscripción a la newsletter",
        react: EmailConfirmarSuscripcionNewsletter(emailProps),
        text: getEmailConfirmarSuscripcionNewsletterText(emailProps),
      },
      { idempotencyKey: `newsletter-confirmation/${submissionId}` }
    );

    if (error) {
      console.error("[newsletter] Resend confirmation failed", { error: error.message });
      const confirmationFallbackSent = await sendConfirmationEmailToOwner({
        email,
        submissionId,
        confirmationTokenHash: subscription.confirmationTokenHash,
        emailProps,
      });
      return getStoredSubscriptionResponse(confirmationFallbackSent);
    }

    try {
      await markNewsletterConfirmationEmailSent(email, subscription.confirmationTokenHash);
    } catch (error) {
      console.error("[newsletter] Failed to record confirmation email delivery", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return Response.json({
      ok: true,
      created: true,
      alreadySubscribed: false,
      confirmationEmailSent: true,
    });
  } catch (error) {
    console.error("[newsletter] Email service failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    const confirmationFallbackSent = await sendConfirmationEmailToOwner({
      email,
      submissionId,
      confirmationTokenHash: subscription.confirmationTokenHash,
      emailProps,
    });
    return getStoredSubscriptionResponse(confirmationFallbackSent);
  }
}
