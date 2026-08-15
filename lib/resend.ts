import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

let resendClient: Resend | undefined;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  resendClient ??= new Resend(apiKey);

  return resendClient;
}

export function getNotificationEmailConfig() {
  return {
    from: process.env.RESEND_FROM_EMAIL?.trim() || "Rubén Palomo <onboarding@resend.dev>",
    to: process.env.RESEND_NOTIFICATION_EMAIL?.trim() || siteConfig.email,
  };
}
