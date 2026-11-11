function Diagrama({ tipo }: { tipo: string }) {
  if (tipo === 'ejes') {
    return (
      <svg className="paso-diagrama" viewBox="0 0 100 80" aria-hidden="true">
        <line x1="15" y1="70" x2="90" y2="70" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
        <line x1="15" y1="70" x2="15" y2="10" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
      </svg>
    );
  }

  if (tipo === 'graduacion') {
    return (
      <svg className="paso-diagrama" viewBox="0 0 100 80" aria-hidden="true">
        <line x1="15" y1="70" x2="15" y2="10" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
          const y = 70 - (n / 8) * 55;
          return (
            <g key={n}>
              <line x1="10" y1={y} x2="15" y2={y} style={{ stroke: 'var(--color-tinta)' }} strokeWidth="1" />
              <text x="7" y={y + 2} textAnchor="end" fontSize="5" style={{ fill: 'var(--color-tinta)' }}>
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (tipo === 'cuadricula') {
    return (
      <svg className="paso-diagrama" viewBox="0 0 100 80" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const x = 15 + i * 10;
          return <line key={`v${i}`} x1={x} y1="10" x2={x} y2="70" style={{ stroke: 'var(--color-borde)' }} strokeWidth="0.5" />;
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const y = 10 + i * 7.5;
          return <line key={`h${i}`} x1="15" y1={y} x2="90" y2={y} style={{ stroke: 'var(--color-borde)' }} strokeWidth="0.5" />;
        })}
        <line x1="15" y1="70" x2="90" y2="70" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
        <line x1="15" y1="70" x2="15" y2="10" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
      </svg>
    );
  }

  // barras
  return (
    <svg className="paso-diagrama" viewBox="0 0 100 80" aria-hidden="true">
      <line x1="15" y1="70" x2="90" y2="70" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
      <line x1="15" y1="70" x2="15" y2="10" style={{ stroke: 'var(--color-tinta)' }} strokeWidth="2" />
      <rect x="25" y="40" width="14" height="30" style={{ fill: 'var(--color-acento)' }} />
      <rect x="47" y="25" width="14" height="45" style={{ fill: 'var(--color-acento)' }} />
      <rect x="69" y="50" width="14" height="20" style={{ fill: 'var(--color-acento)' }} />
      <text x="32" y="78" textAnchor="middle" fontSize="5" style={{ fill: 'var(--color-tinta)' }}>A</text>
      <text x="54" y="78" textAnchor="middle" fontSize="5" style={{ fill: 'var(--color-tinta)' }}>B</text>
      <text x="76" y="78" textAnchor="middle" fontSize="5" style={{ fill: 'var(--color-tinta)' }}>C</text>
    </svg>
  );
}

export default function PasosConstruccion({
  pasos,
  diagramas = [],
}: {
  pasos: string[];
  diagramas?: string[];
}) {
  return (
    <ol className="pasos">
      {pasos.map((paso, i) => (
        <li key={i} className="paso">
          <span className="paso-numero" aria-hidden="true">{i + 1}</span>
          <div className="paso-cuerpo">
            <span>{paso}</span>
            {diagramas[i] && <Diagrama tipo={diagramas[i]} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
