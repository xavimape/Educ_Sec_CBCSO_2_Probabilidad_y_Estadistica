import { useEffect, useState } from 'react';

const ETIQUETAS = ['0–10', '10–20', '20–30', '30–40'];
const COLOR = '#1d4ed8'; // --color-acento
const MAX = 8;
const ALTO = 120;
const ANCHO = 200;

export default function Histograma() {
  const [listo, setListo] = useState(false);
  const [frecuencias, setFrecuencias] = useState<number[]>([2, 5, 6, 3]);

  useEffect(() => setListo(true), []);

  const anchoBarra = ANCHO / frecuencias.length;

  return (
    <section className="grafico">
      {!listo && <p className="aviso-hidratacion">Cargando la actividad… Si no responde en unos segundos, esta actividad necesita conexión la primera vez.</p>}
      <p>En un histograma las barras son contiguas (sin separación) porque los intervalos son continuos.</p>

      <svg viewBox={`0 0 ${ANCHO} ${ALTO + 12}`} width="100%" className="svg-grafico" role="img">
        <title>Histograma de frecuencias por intervalo</title>
        <desc>Barras contiguas con la frecuencia de cada intervalo.</desc>
        {frecuencias.map((f, i) => {
          const h = (Math.min(f, MAX) / MAX) * ALTO;
          return <rect key={i} x={i * anchoBarra} y={ALTO - h} width={anchoBarra} height={h} fill={COLOR} />;
        })}
        <line x1="0" y1={ALTO} x2={ANCHO} y2={ALTO} stroke="#64748b" strokeWidth="1" />
      </svg>

      <div className="campos-frecuencias">
        {ETIQUETAS.map((et, i) => (
          <label key={et} className="campo">
            {et}:
            <input
              type="number"
              min={0}
              value={frecuencias[i]}
              disabled={!listo}
              onChange={(e) => {
                const v = Math.max(0, Number(e.target.value) || 0);
                setFrecuencias((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
              aria-label={`Frecuencia del intervalo ${et}`}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
