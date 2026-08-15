import EmailContacto, { getEmailContactoText } from "@/emails/EmailContacto";
import { getNotificationEmailConfig, getResendClient } from "@/lib/resend";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 20_000;
const PROJECT_TYPES = new Set([
  "Desarrollo web",
  "Software a medida",
  "Automatización",
  "Inteligencia artificial",
  "Consultoría",
  "Otro",
]);

type ContactPayload = {
  submissionId?: unknown;
  name?: unknown;
  company?: unknown;
  email?: unknown;
  projectType?: unknown;
  message?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const text = value.trim();
  return text.length <= maxLength ? text : null;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json({ ok: false, error: "Request too large" }, { status: 413 });
  }

  let payload: ContactPayload;
  try {
    const parsedPayload: unknown = await request.json();
    if (!parsedPayload || typeof parsedPayload !== "object" || Array.isArray(parsedPayload)) {
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    payload = parsedPayload as ContactPayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const submissionId = cleanText(payload.submissionId, 64);
  const name = cleanText(payload.name, 120);
  const company = cleanText(payload.company, 160);
  const email = cleanText(payload.email, 254)?.toLowerCase() ?? null;
  const projectType = cleanText(payload.projectType, 80);
  const message = cleanText(payload.message, 4_000);

  if (
    !submissionId ||
    !/^[a-z0-9-]{16,64}$/i.test(submissionId) ||
    !name ||
    company === null ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !projectType ||
    !PROJECT_TYPES.has(projectType) ||
    !message ||
    message.length < 20
  ) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const emailProps = {
    name,
    company,
    email,
    projectType,
    message,
    submittedAt,
  };

  try {
    const resend = getResendClient();
    const { from, to } = getNotificationEmailConfig();
    const { error } = await resend.emails.send(
      {
        from,
        to,
        replyTo: email,
        subject: `Nueva consulta: ${projectType} — ${name}`,
        react: EmailContacto(emailProps),
        text: getEmailContactoText(emailProps),
      },
      { idempotencyKey: `contact/${submissionId}` }
    );

    if (error) {
      console.error("[contact] Resend delivery failed", { error: error.message });
      return Response.json({ ok: false, error: "Contact delivery failed", fallback: "mailto" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact] Email service failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, error: "Email service unavailable", fallback: "mailto" }, { status: 503 });
  }
}
