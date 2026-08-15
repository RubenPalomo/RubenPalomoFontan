import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirmación de newsletter | Rubén Palomo",
  robots: { index: false, follow: false },
};

type ConfirmationPageProps = {
  searchParams: Promise<{ estado?: string | string[] }>;
};

const confirmationMessages = {
  confirmada: {
    eyebrow: "Suscripción confirmada",
    title: "Ya estás dentro.",
    description: "Tu email ha quedado confirmado. Recibirás las próximas ediciones de la newsletter.",
  },
  "ya-confirmada": {
    eyebrow: "Suscripción activa",
    title: "Tu email ya estaba confirmado.",
    description: "No necesitas hacer nada más. Tu suscripción a la newsletter continúa activa.",
  },
  expired: {
    eyebrow: "Enlace caducado",
    title: "Este enlace ya no está disponible.",
    description: "Vuelve a la web e intenta suscribirte de nuevo para recibir un nuevo enlace de confirmación.",
  },
  invalid: {
    eyebrow: "Enlace no válido",
    title: "No hemos podido validar este enlace.",
    description: "Comprueba que has abierto el enlace completo incluido en el correo de confirmación.",
  },
  error: {
    eyebrow: "Error temporal",
    title: "No hemos podido confirmar tu suscripción.",
    description: "Inténtalo de nuevo dentro de unos minutos desde el mismo enlace del correo.",
  },
} as const;

export default async function NewsletterConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { estado: rawStatus } = await searchParams;
  const status = typeof rawStatus === "string" ? rawStatus : "invalid";
  const message = confirmationMessages[status as keyof typeof confirmationMessages] ?? confirmationMessages.invalid;

  return (
    <main className="newsletter-confirmation-main">
      <section className="newsletter-confirmation-card" aria-labelledby="confirmation-title">
        <Link className="newsletter-confirmation-brand" href="/">
          RUBÉN PALOMO
        </Link>
        <p className="eyebrow">{message.eyebrow}</p>
        <h1 id="confirmation-title">{message.title}</h1>
        <p>{message.description}</p>
        <Link className="button button-primary" href="/#newsletter">
          Volver a la web <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
