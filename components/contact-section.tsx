import { siteConfig } from "@/lib/site";

import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section className="section contact-section" id="contacto">
      <div className="container">
        <div className="contact-intro">
          <p className="eyebrow">Contacto</p>
          <h2>Cuéntame qué necesitas.</h2>
          <p>
            No hace falta que tengas la solución clara. Explícame qué problema quieres resolver y te diré con honestidad
            si puedo ayudarte.
          </p>
          <div className="contact-links">
            <a href={`mailto:${siteConfig.email}`}>
              <span>Correo</span>
              <strong>{siteConfig.email}</strong>
            </a>
            <a href={`tel:${siteConfig.phone}`}>
              <span>Teléfono</span>
              <strong>{siteConfig.phoneLabel}</strong>
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
