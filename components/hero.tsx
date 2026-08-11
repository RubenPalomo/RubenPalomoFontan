import { siteConfig } from "@/lib/site";

const solutionSteps = [
  ["01", "Detectar el bloqueo", "Tareas manuales, datos aislados o poca visibilidad."],
  ["02", "Diseñar la solución", "Solo la tecnología necesaria para resolverlo."],
  ["03", "Medir la mejora", "Más control, menos pasos y un proceso mantenible."],
] as const;

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Desarrollo web · Automatización · IA aplicada</p>
          <h1 id="hero-title">
            Desarrollo software, automatizo procesos e implemento IA para que tu empresa{" "}
            <span>trabaje mejor.</span>
          </h1>
          <p className="hero-lead">
            Creo soluciones web y software a medida, conecto herramientas y elimino tareas
            repetitivas. También te ayudo a identificar y aplicar la inteligencia artificial allí
            donde aporta un valor real.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contacto">
              Cuéntame tu proyecto <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href="#servicios">
              Ver servicios <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="profile-links" aria-label="Perfiles profesionales">
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Enfoque de las soluciones">
          <div className="panel-topline">
            <span>Un proceso más claro</span>
            <span className="status-dot">En marcha</span>
          </div>
          <p className="panel-title">De la fricción diaria a un sistema que fluye</p>
          <ol className="solution-flow">
            {solutionSteps.map(([number, title, description]) => (
              <li key={number}>
                <span className="flow-number">{number}</span>
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="panel-note">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>Primero el problema.</strong> Después, la tecnología.
            </p>
          </div>
        </aside>
      </div>

      <div className="container audience-strip" aria-label="Público objetivo">
        <p>Soluciones pensadas para</p>
        <ul>
          <li>Autónomos</li>
          <li>Pequeñas empresas</li>
          <li>Pymes</li>
          <li>Equipos que quieren avanzar</li>
        </ul>
      </div>
    </section>
  );
}
