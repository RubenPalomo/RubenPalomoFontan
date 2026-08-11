const problems = [
  {
    label: "Tiempo perdido",
    title: "Tareas manuales que se repiten cada día",
    solution:
      "Automatizar pasos, documentos, avisos y flujos para reducir trabajo repetitivo y errores evitables.",
  },
  {
    label: "Datos desconectados",
    title: "La misma información copiada entre varias herramientas",
    solution:
      "Integrar aplicaciones y sincronizar datos mediante APIs para mantener una única información coherente.",
  },
  {
    label: "Poco control",
    title: "Procesos difíciles de seguir y decisiones sin contexto",
    solution:
      "Crear herramientas internas, paneles y bases de datos que hagan visible lo importante en cada momento.",
  },
  {
    label: "Presencia digital",
    title: "Una web anticuada o que no facilita el contacto",
    solution:
      "Diseñar una experiencia rápida, clara y enfocada a explicar el valor del negocio y generar conversaciones.",
  },
  {
    label: "Atención repetitiva",
    title: "Las mismas consultas consumen una y otra vez al equipo",
    solution:
      "Organizar el conocimiento y automatizar respuestas o clasificaciones manteniendo el control humano.",
  },
  {
    label: "IA sin rumbo",
    title: "Dudas sobre dónde puede aportar realmente la IA",
    solution:
      "Analizar casos de uso, riesgos y viabilidad antes de implementar una solución práctica conectada al proceso real.",
    accent: true,
  },
] as const;

export function Problems() {
  return (
    <section className="section problems-section" id="problemas">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Problemas que resuelvo</p>
            <h2>Menos fricción. Más tiempo para tu negocio.</h2>
          </div>
          <p>
            La digitalización empieza por detectar qué está frenando al equipo. A partir de ahí,
            construyo una solución concreta, fácil de usar y preparada para evolucionar.
          </p>
        </div>

        <div className="problem-grid">
          {problems.map((problem) => (
            <article
              className={`problem-card${"accent" in problem ? " accent-card" : ""}`}
              key={problem.label}
            >
              <p className="problem-label">{problem.label}</p>
              <h3>{problem.title}</h3>
              <div className="card-divider" aria-hidden="true" />
              <p className="solution-label">La solución</p>
              <p>{problem.solution}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
