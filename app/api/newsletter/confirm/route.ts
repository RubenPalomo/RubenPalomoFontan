import EmailNuevaSuscripcionNewsletter, {
  getEmailNuevaSuscripcionNewsletterText,
} from "@/emails/EmailNuevaSuscripcionNewsletter";
import { confirmNewsletterSubscription, markNewsletterNotificationSent } from "@/lib/newsletter";
import { getNotificationEmailConfig, getResendClient } from "@/lib/resend";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";

function redirectToConfirmationPage(status: string) {
  const destination = new URL("/newsletter/confirmacion", siteUrl);
  destination.searchParams.set("estado", status);

  return new Response(null, {
    status: 303,
    headers: {
      "Cache-Control": "no-store",
      Location: destination.toString(),
    },
  });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() || "";

  try {
    const result = await confirmNewsletterSubscription(token);

    if (result.status !== "confirmed") {
      const status = result.status === "already-confirmed" ? "ya-confirmada" : result.status;
      return redirectToConfirmationPage(status);
    }

    const subscriber = result.subscriber;
    const confirmedAt = subscriber.confirmedAt ?? new Date();
    const emailProps = {
      name: subscriber.name,
      email: subscriber.email,
      company: subscriber.company || "",
      source: subscriber.source || "",
      submittedAt: confirmedAt.toISOString(),
    };

    try {
      const resend = getResendClient();
      const { from, to } = getNotificationEmailConfig();
      const { error } = await resend.emails.send(
        {
          from,
          to,
          replyTo: subscriber.email,
          subject: `Nueva suscripción confirmada — ${subscriber.name}`,
          react: EmailNuevaSuscripcionNewsletter(emailProps),
          text: getEmailNuevaSuscripcionNewsletterText(emailProps),
        },
        { idempotencyKey: `newsletter-notification/${subscriber._id.toString()}` }
      );

      if (error) {
        console.error("[newsletter] Resend confirmation notification failed", { error: error.message });
      } else {
        await markNewsletterNotificationSent(subscriber._id);
      }
    } catch (error) {
      console.error("[newsletter] Confirmation notification failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return redirectToConfirmationPage("confirmada");
  } catch (error) {
    console.error("[newsletter] Confirmation failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return redirectToConfirmationPage("error");
  }
}
