type ContactMailtoData = {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
};

export function buildContactMailtoUrl(recipient: string, data: ContactMailtoData) {
  const subject = `Proyecto de ${data.projectType} — ${data.name}`;
  const body = [
    "Hola Rubén,",
    "",
    `Soy ${data.name}${data.company ? `, de ${data.company}` : ""}.`,
    `Mi email de contacto es ${data.email}.`,
    `Tipo de proyecto: ${data.projectType}.`,
    "",
    "Contexto del proyecto:",
    data.message,
    "",
    "Gracias.",
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
