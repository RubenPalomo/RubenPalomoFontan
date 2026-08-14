const services = [
  {
    number: "01",
    category: "Presencia y producto digital",
    title: "Desarrollo web",
    intro: "Sitios y aplicaciones rápidos, accesibles y alineados con el objetivo del negocio.",
    items: [
      "Webs corporativas y landing pages",
      "Portales internos y aplicaciones web",
      "Experiencia de usuario y rendimiento",
      "Mantenimiento y evolución",
    ],
  },
  {
    number: "02",
    category: "Herramientas adaptadas",
    title: "Software a medida",
    intro: "Sistemas construidos alrededor de tu forma de trabajar, no al revés.",
    items: [
      "Herramientas internas y de gestión",
      "APIs y paneles de administración",
      "Bases de datos",
      "Integración con sistemas existentes",
    ],
  },
  {
    number: "03",
    category: "Procesos conectados",
    title: "Automatización",
    intro: "Flujos que reducen tareas repetitivas y mantienen la información donde debe estar.",
    items: [
      "Sincronización de datos",
      "Documentos, notificaciones y flujos",
      "Integraciones con CRM, ERP y Microsoft 365",
      "Automatización mediante APIs",
    ],
  },
  {
    number: "04",
    category: "IA con propósito",
    title: "Inteligencia artificial",
    intro: "Asesoría e implementación para aplicar IA de forma útil, comprensible y conectada a tu actividad.",
    items: [
      "Chatbots, asistentes y agentes de IA",
      "Clasificación y procesamiento de mensajes",
      "Consulta sobre documentación interna",
      "Detección e integración de casos de uso",
    ],
    dark: true,
  },
] as const;

export function Services() {
  return (
    <section className="section services-section" id="servicios">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2>La solución adecuada para cada reto.</h2>
          </div>
          <p>Puedo ayudarte desde una necesidad puntual hasta el desarrollo y evolución de una herramienta completa.</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className={`service-card${"dark" in service ? " service-card-dark" : ""}`} key={service.number}>
              <div className="service-card-heading">
                <span>{service.number}</span>
                <p>{service.category}</p>
              </div>
              <h3>{service.title}</h3>
              <p className="service-intro">{service.intro}</p>
              <ul className="check-list">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
