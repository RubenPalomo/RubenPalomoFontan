import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies | Rubén Palomo",
  description: "Información sobre las cookies analíticas utilizadas en la web de Rubén Palomo.",
};

export default function CookiesPage() {
  return (
    <main className="legal-main">
      <article className="legal-card">
        <Link className="legal-brand" href="/">
          Rubén Palomo
        </Link>
        <p className="eyebrow">Información legal</p>
        <h1>Política de cookies</h1>
        <p className="legal-updated">Última actualización: 20 de agosto de 2026</p>

        <section>
          <h2>Qué utiliza esta web</h2>
          <p>
            Esta web utiliza Microsoft Clarity y Google Analytics para obtener mediciones básicas de las visitas sin
            cookies. Si aceptas las cookies analíticas, también permite obtener estadísticas, mapas de calor y
            grabaciones de interacción para entender cómo mejorar la página.
          </p>
          <p>
            Los campos de los formularios de newsletter y contacto están expresamente enmascarados. No se envían a
            Clarity nombres, direcciones de correo ni el contenido de los mensajes.
          </p>
        </section>

        <section>
          <h2>Cookies analíticas</h2>
          <p>
            Clarity puede utilizar cookies como <code>_clck</code>, para mantener un identificador seudónimo de la
            visita, y <code>_clsk</code>, para agrupar páginas dentro de una misma sesión. La integración rechaza
            expresamente el almacenamiento destinado a publicidad.
          </p>
          <p>
            Google Analytics puede utilizar cookies como <code>_ga</code> para distinguir visitas y elaborar
            estadísticas de uso. El almacenamiento publicitario permanece deshabilitado tanto si aceptas como si
            rechazas.
          </p>
          <p>
            Puedes consultar la información actualizada en la{" "}
            <a
              href="https://learn.microsoft.com/es-es/clarity/setup-and-installation/clarity-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentación de cookies de Microsoft Clarity
            </a>
            .
          </p>
          <p>
            También puedes consultar la{" "}
            <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">
              información de Google sobre el uso de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Cómo cambiar tu decisión</h2>
          <p>
            Puedes abrir de nuevo el panel mediante el botón «Configurar cookies», disponible en la parte inferior de la
            web. Si retiras el consentimiento, se eliminan las cookies de Clarity y las siguientes visitas se miden sin
            cookies, sin vincular las distintas páginas como una misma sesión. La elección se conserva durante un máximo
            de doce meses.
          </p>
        </section>

        <section>
          <h2>Contacto</h2>
          <p>
            Si tienes alguna duda sobre esta política, puedes escribir a{" "}
            <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a>.
          </p>
        </section>

        <Link className="button button-primary legal-back" href="/">
          Volver a la web <span aria-hidden="true">→</span>
        </Link>
      </article>
    </main>
  );
}
