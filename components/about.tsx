import Image from "next/image";

export function About() {
  return (
    <section className="section about-section" id="sobre-mi">
      <div className="container about-grid">
        <figure className="portrait">
          <div className="portrait-frame">
            <Image
              src="/images/ruben-palomo-profesional.jpg"
              alt="Rubén Palomo dando una charla con un micrófono"
              width={800}
              height={800}
              sizes="(max-width: 768px) calc(100vw - 2rem), 50vw"
            />
          </div>
          <figcaption>
            <span>Rubén Palomo</span>
            Desarrollo de soluciones digitales
          </figcaption>
        </figure>

        <div className="about-copy">
          <p className="eyebrow">Sobre mí</p>
          <h2>Tecnología entendida desde el problema.</h2>
          <p className="about-lead">
            Soy desarrollador de software y me centro en convertir procesos complejos o manuales
            en soluciones digitales claras y mantenibles.
          </p>
          <p>
            Combino desarrollo frontend y backend, trabajo con datos e integraciones y experiencia
            en aplicaciones para distintos entornos. Me interesa especialmente la automatización y
            el uso práctico de la inteligencia artificial para mejorar cómo trabajan las pequeñas
            empresas.
          </p>
          <p>
            Trabajo con comunicación directa, explicando las decisiones sin jerga innecesaria y
            validando cada fase con quien conoce el negocio. El objetivo es que la solución encaje
            hoy y pueda evolucionar mañana.
          </p>
          <div className="about-values">
            <div>
              <strong>Comunicación directa</strong>
              <span>Alcance, prioridades y avances siempre claros.</span>
            </div>
            <div>
              <strong>Soluciones mantenibles</strong>
              <span>Código y procesos preparados para evolucionar.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
