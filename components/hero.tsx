import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Software para autónomos y empresas</p>
          <h1 id="hero-title">Te ayudo a trabajar mejor con soluciones digitales sencillas.</h1>
          <p className="hero-lead">
            Desarrollo webs y herramientas a medida, conecto aplicaciones y automatizo tareas repetitivas. Si la
            inteligencia artificial puede aportar algo útil, te ayudo a aplicarla sin complicar el negocio.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contacto">
              Cuéntame qué necesitas <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#servicios">
              Ver en qué puedo ayudarte <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-meta">
            <p>Trabajo directamente contigo, desde el problema hasta la solución.</p>
            <div className="profile-links" aria-label="Perfiles profesionales">
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
