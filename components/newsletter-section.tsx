import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section className="section newsletter-section" id="newsletter">
      <div className="container newsletter-grid">
        <div className="newsletter-copy">
          <p className="eyebrow">Newsletter</p>
          <h2>Ideas útiles para vender más tiempo, no más horas.</h2>
          <p>
            Recibe contenidos prácticos sobre ofertas digitales, automatización de tareas, inteligencia artificial
            aplicada y formas realistas de ganar productividad y alcance en negocios pequeños.
          </p>
          <ul className="newsletter-points">
            <li>Casos concretos para autónomos y pymes.</li>
            <li>Procesos repetitivos que se pueden simplificar.</li>
            <li>Ideas para llegar mejor a clientes sin añadir más carga.</li>
          </ul>
        </div>

        <NewsletterForm />
      </div>
    </section>
  );
}
