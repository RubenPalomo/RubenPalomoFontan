const workAreas = [
  [
    "⌁",
    "Aplicaciones web y de gestión",
    "Interfaces, lógica de negocio, paneles, formularios y flujos conectados a datos.",
  ],
  [
    "↻",
    "Automatizaciones y bots",
    "Scripts, tareas programadas, notificaciones y procesos que eliminan pasos repetitivos.",
  ],
  [
    "◇",
    "Integraciones y APIs",
    "Intercambio de información, servicios backend y conexión entre sistemas mediante APIs y JSON.",
  ],
  [
    "✦",
    "IA y experiencias interactivas",
    "Asistentes, procesamiento de información y experiencia previa en aplicaciones de realidad virtual y aumentada.",
  ],
] as const;

const technologyGroups = [
  ["Web y backend", ["JavaScript", "TypeScript", "Node.js", "Python", "Java", "C#", "HTML", "CSS"]],
  ["Datos e integraciones", ["SQL", "PostgreSQL", "MySQL", "MongoDB", "REST APIs", "JSON", "Microsoft 365"]],
  ["Entrega e IA", ["Git", "GitHub", "APIs de IA", "Automatización con IA"]],
] as const;

export function Capabilities() {
  return (
    <section className="section capabilities-section" id="capacidades">
      <div className="container">
        <div className="section-heading split-heading light-heading">
          <div>
            <p className="eyebrow">Capacidades</p>
            <h2>Soluciones que puedo desarrollar.</h2>
          </div>
          <p>
            Mi experiencia técnica abarca aplicaciones, automatización, integración de datos y desarrollo en distintos
            entornos. La herramienta se elige según el problema.
          </p>
        </div>

        <div className="work-areas">
          {workAreas.map(([icon, title, description]) => (
            <article key={title}>
              <span aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className="technology-groups">
          {technologyGroups.map(([title, items]) => (
            <div key={title}>
              <p>{title}</p>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
