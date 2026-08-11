import { siteConfig } from "@/lib/site";

import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section className="section contact-section" id="contacto">
      <div className="container">
        <div className="contact-intro">
          <p className="eyebrow">Contacto</p>
          <h2>¿Tienes un proceso que mejorar o una idea que poner en marcha?</h2>
          <p>
            Cuéntame qué está pasando ahora, qué te gustaría conseguir y qué herramientas
            utilizas. Revisaré el contexto y podremos valorar el siguiente paso.
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
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
              <span>Perfil profesional</span>
              <strong>
                LinkedIn <i aria-hidden="true">↗</i>
              </strong>
            </a>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              <span>Código y proyectos</span>
              <strong>
                GitHub <i aria-hidden="true">↗</i>
              </strong>
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
