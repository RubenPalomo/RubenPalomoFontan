const MAX_REQUEST_BYTES = 10_000;

type NewsletterPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  consent?: unknown;
  source?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeMarkdown(value: string) {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
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

  const telegramToken = process.env.TELEGRAM_TOKEN;
  const telegramId = process.env.TELEGRAM_ID;

  if (!telegramToken || !telegramId) {
    return Response.json({ ok: false, error: "Telegram is not configured" }, { status: 500 });
  }

  const text = [
    "*Nueva suscripción a la newsletter*",
    "",
    `*Nombre:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    company ? `*Empresa:* ${escapeMarkdown(company)}` : "",
    "",
    escapeMarkdown("Interés: ofertas, automatización, productividad, alcance e IA aplicada."),
    source ? `Origen: ${escapeMarkdown(source)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramId,
          text,
          parse_mode: "MarkdownV2",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      console.error("[newsletter] Telegram notification failed", {
        status: telegramResponse.status,
        description: telegramError.slice(0, 500),
      });
      return Response.json(
        { ok: false, error: "Telegram notification failed" },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[newsletter] Telegram request failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { ok: false, error: "Telegram notification failed" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
