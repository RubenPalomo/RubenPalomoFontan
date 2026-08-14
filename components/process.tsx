const steps = [
  ["01", "Análisis", "Entender el problema, el proceso actual y el resultado esperado."],
  ["02", "Propuesta", "Definir solución, alcance, prioridades y criterios de éxito."],
  ["03", "Desarrollo", "Construir por fases para obtener avances visibles y útiles."],
  ["04", "Validación", "Probar contigo que la solución responde al trabajo real."],
  ["05", "Puesta en marcha", "Desplegar con control y dejar el funcionamiento documentado."],
  ["06", "Evolución", "Dar soporte, medir la mejora y adaptar lo que sea necesario."],
] as const;

export function Process() {
  return (
    <section className="section process-section" id="proceso">
      <div className="container">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Cómo trabajo</p>
          <h2>Un proceso claro de principio a fin.</h2>
          <p>
            Sin capas innecesarias. Entendemos el problema, definimos el alcance y avanzamos por fases que se pueden
            revisar.
          </p>
        </div>

        <ol className="process-list">
          {steps.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>

        <div className="process-principle">
          <span aria-hidden="true">“</span>
          <p>
            El objetivo no es añadir tecnología por añadirla, sino resolver un problema real y conseguir una mejora que
            se pueda observar.
          </p>
        </div>
      </div>
    </section>
  );
}
