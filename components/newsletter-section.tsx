import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section className="section newsletter-section" id="newsletter">
      <div className="container newsletter-grid">
        <div className="newsletter-copy">
          <p className="eyebrow">Newsletter</p>
          <h2>Ideas útiles para trabajar mejor.</h2>
          <p>
            Comparto aprendizajes sobre software, automatización e inteligencia artificial aplicados a problemas reales
            de autónomos y pequeñas empresas.
          </p>
          <p className="newsletter-promise">Sin ruido. Solo cuando tenga algo que merezca la pena contar.</p>
        </div>

        <NewsletterForm />
      </div>
    </section>
  );
}
