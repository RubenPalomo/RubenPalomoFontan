import { Fragment } from "react";
import { Link, Text } from "react-email";

import { EmailField, EmailLayout, emailContentStyles, formatEmailDate } from "@/emails/components/EmailLayout";

export type EmailContactoProps = {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
  submittedAt: string;
};

const previewProps = {
  name: "Ana García",
  company: "Estudio Norte",
  email: "ana@example.com",
  projectType: "Automatización",
  message:
    "Quiero automatizar la recepción de solicitudes y conectarlas con las herramientas que ya utiliza mi empresa.",
  submittedAt: "2026-08-15T08:00:00.000Z",
} satisfies EmailContactoProps;

export default function EmailContacto({
  name = previewProps.name,
  company = previewProps.company,
  email = previewProps.email,
  projectType = previewProps.projectType,
  message = previewProps.message,
  submittedAt = previewProps.submittedAt,
}: EmailContactoProps) {
  return (
    <EmailLayout
      preview={`Nueva consulta de ${name}`}
      eyebrow="FORMULARIO DE CONTACTO"
      title="Tienes una nueva consulta"
    >
      <Text style={emailContentStyles.intro}>Estos son los datos enviados desde tu web profesional.</Text>
      <EmailField label="Nombre">{name}</EmailField>
      <EmailField label="Empresa">{company || "No indicada"}</EmailField>
      <EmailField label="Email">
        <Link href={`mailto:${email}`} style={emailContentStyles.link}>
          {email}
        </Link>
      </EmailField>
      <EmailField label="Tipo de proyecto">{projectType}</EmailField>
      <Text style={emailContentStyles.meta}>MENSAJE</Text>
      <Text style={emailContentStyles.message}>
        {message.split("\n").map((line, index, lines) => (
          <Fragment key={`${index}-${line}`}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </Text>
      <Text style={emailContentStyles.meta}>Enviado el {formatEmailDate(submittedAt)}.</Text>
    </EmailLayout>
  );
}

export function getEmailContactoText({ name, company, email, projectType, message, submittedAt }: EmailContactoProps) {
  return [
    "Nueva consulta desde rubenpalomo.vercel.app",
    "",
    `Nombre: ${name}`,
    `Empresa: ${company || "No indicada"}`,
    `Email: ${email}`,
    `Tipo de proyecto: ${projectType}`,
    "",
    "Mensaje:",
    message,
    "",
    `Enviado el ${formatEmailDate(submittedAt)}.`,
  ].join("\n");
}

EmailContacto.PreviewProps = previewProps;
