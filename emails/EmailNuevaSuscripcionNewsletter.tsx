import { Link, Text } from "react-email";

import { EmailField, EmailLayout, emailContentStyles, formatEmailDate } from "@/emails/components/EmailLayout";

export type EmailNuevaSuscripcionNewsletterProps = {
  name: string;
  email: string;
  company: string;
  source: string;
  submittedAt: string;
};

const previewProps = {
  name: "Carlos Martín",
  email: "carlos@example.com",
  company: "Taller Central",
  source: "https://rubenpalomo.vercel.app/#newsletter",
  submittedAt: "2026-08-15T08:00:00.000Z",
} satisfies EmailNuevaSuscripcionNewsletterProps;

export default function EmailNuevaSuscripcionNewsletter({
  name = previewProps.name,
  email = previewProps.email,
  company = previewProps.company,
  source = previewProps.source,
  submittedAt = previewProps.submittedAt,
}: EmailNuevaSuscripcionNewsletterProps) {
  return (
    <EmailLayout preview={`Nueva suscripción de ${name}`} eyebrow="NEWSLETTER" title="Nueva suscripción recibida">
      <Text style={emailContentStyles.intro}>Una persona ha aceptado recibir las próximas ediciones.</Text>
      <EmailField label="Nombre">{name}</EmailField>
      <EmailField label="Email">
        <Link href={`mailto:${email}`} style={emailContentStyles.link}>
          {email}
        </Link>
      </EmailField>
      <EmailField label="Empresa">{company || "No indicada"}</EmailField>
      <EmailField label="Origen">{source || "No indicado"}</EmailField>
      <Text style={emailContentStyles.meta}>Consentimiento registrado el {formatEmailDate(submittedAt)}.</Text>
    </EmailLayout>
  );
}

export function getEmailNuevaSuscripcionNewsletterText({
  name,
  email,
  company,
  source,
  submittedAt,
}: EmailNuevaSuscripcionNewsletterProps) {
  return [
    "Nueva suscripción a la newsletter",
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Empresa: ${company || "No indicada"}`,
    `Origen: ${source || "No indicado"}`,
    `Consentimiento registrado el ${formatEmailDate(submittedAt)}.`,
  ].join("\n");
}

EmailNuevaSuscripcionNewsletter.PreviewProps = previewProps;
