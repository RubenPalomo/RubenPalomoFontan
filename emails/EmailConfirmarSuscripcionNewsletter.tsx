import { Button, Link, Text } from "react-email";

import { EmailLayout, emailContentStyles, formatEmailDate } from "@/emails/components/EmailLayout";

export type EmailConfirmarSuscripcionNewsletterProps = {
  name: string;
  confirmationUrl: string;
  expiresAt: string;
};

const previewProps = {
  name: "Carlos Martín",
  confirmationUrl: "https://rubenpalomo.vercel.app/api/newsletter/confirm?token=example",
  expiresAt: "2026-08-17T08:00:00.000Z",
} satisfies EmailConfirmarSuscripcionNewsletterProps;

export default function EmailConfirmarSuscripcionNewsletter({
  name = previewProps.name,
  confirmationUrl = previewProps.confirmationUrl,
  expiresAt = previewProps.expiresAt,
}: EmailConfirmarSuscripcionNewsletterProps) {
  return (
    <EmailLayout preview="Confirma tu suscripción a la newsletter" eyebrow="NEWSLETTER" title="Confirma tu email">
      <Text style={emailContentStyles.intro}>Hola, {name}.</Text>
      <Text style={emailContentStyles.message}>
        Para completar tu suscripción y empezar a recibir la newsletter, confirma que este email es tuyo.
      </Text>
      <Button href={confirmationUrl} style={styles.button}>
        Confirmar suscripción
      </Button>
      <Text style={emailContentStyles.meta}>El enlace estará disponible hasta el {formatEmailDate(expiresAt)}.</Text>
      <Text style={styles.fallback}>
        Si el botón no funciona, copia y pega este enlace en tu navegador:
        <br />
        <Link href={confirmationUrl} style={emailContentStyles.link}>
          {confirmationUrl}
        </Link>
      </Text>
      <Text style={emailContentStyles.meta}>Si no has solicitado la suscripción, puedes ignorar este mensaje.</Text>
    </EmailLayout>
  );
}

export function getEmailConfirmarSuscripcionNewsletterText({
  name,
  confirmationUrl,
  expiresAt,
}: EmailConfirmarSuscripcionNewsletterProps) {
  return [
    `Hola, ${name}.`,
    "",
    "Confirma tu suscripción a la newsletter abriendo este enlace:",
    confirmationUrl,
    "",
    `El enlace estará disponible hasta el ${formatEmailDate(expiresAt)}.`,
    "",
    "Si no has solicitado la suscripción, puedes ignorar este mensaje.",
  ].join("\n");
}

const styles = {
  button: {
    backgroundColor: "#e56f4d",
    borderRadius: "999px",
    color: "#1d1713",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: "700",
    padding: "14px 22px",
    textDecoration: "none",
  },
  fallback: {
    color: "#6b7d7b",
    fontSize: "12px",
    lineHeight: "20px",
    margin: "24px 0 0",
    wordBreak: "break-word" as const,
  },
};

EmailConfirmarSuscripcionNewsletter.PreviewProps = previewProps;
