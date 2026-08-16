const services = [
  {
    number: "01",
    title: "Una web que explique bien lo que haces",
    description:
      "Creo webs corporativas, páginas de venta y aplicaciones rápidas que ayuden a tus clientes a entenderte y contactar contigo.",
    examples: "Webs · Landing pages · Aplicaciones",
  },
  {
    number: "02",
    title: "Herramientas adaptadas a tu forma de trabajar",
    description:
      "Desarrollo software sencillo para ordenar información, centralizar procesos y evitar que tu equipo dependa de hojas y tareas manuales.",
    examples: "Paneles · Bases de datos · Herramientas internas",
  },
  {
    number: "03",
    title: "Automatización e IA donde tengan sentido",
    description:
      "Conecto las aplicaciones que ya utilizas y automatizo pasos repetitivos. Aplico IA solo cuando reduce trabajo o mejora una decisión.",
    examples: "Integraciones · Flujos · Asistentes de IA",
  },
] as const;

export function Services() {
  return (
    <section className="section services-section" id="servicios">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Qué puedo hacer por ti</p>
          <h2>Menos complicaciones. Más tiempo para tu negocio.</h2>
          <p>
            Podemos empezar por una mejora concreta o construir una solución completa. Lo importante es resolver un
            problema real y que puedas mantener el resultado.
          </p>
        </div>

        <div className="services-list">
          {services.map((service) => (
            <article className="service-item" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <p className="service-examples">{service.examples}</p>
            </article>
          ))}
        </div>

        <a className="text-link services-link" href="#contacto">
          Cuéntame qué te quita tiempo <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
