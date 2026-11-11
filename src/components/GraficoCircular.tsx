import { useEffect, useState } from 'react';

const CATEGORIAS = ['A', 'B', 'C', 'D'];
// Mismos valores que los tokens AA (--color-acento, --color-ok, --color-error + neutro).
const COLORES = ['#1d4ed8', '#15803d', '#b91c1c', '#64748b'];
const R = 80;
const CX = 100;
const CY = 100;
const DOS_PI = Math.PI * 2;

function punto(angulo: number) {
  return { x: CX + R * Math.cos(angulo), y: CY + R * Math.sin(angulo) };
}

type Porcion = { inicio: number; fin: number; color: string; etiqueta: string };

export default function GraficoCircular() {
  const [listo, setListo] = useState(false);
  const [frecuencias, setFrecuencias] = useState<number[]>([4, 3, 2, 1]);

  useEffect(() => setListo(true), []);

  const total = frecuencias.reduce((s, f) => s + f, 0);
  const porciones: Porcion[] = [];
  let acumulado = -Math.PI / 2;
  for (let i = 0; i < frecuencias.length; i++) {
    const inicio = acumulado;
    const fin = total > 0 ? inicio + (frecuencias[i] / total) * DOS_PI : inicio;
    porciones.push({ inicio, fin, color: COLORES[i % COLORES.length], etiqueta: CATEGORIAS[i] });
    acumulado = fin;
  }

  return (
    <section className="grafico">
      {!listo && <p className="aviso-hidratacion">Cargando la actividad… Si no responde en unos segundos, esta actividad necesita conexión la primera vez.</p>}
      <p>Cada porción es la parte del total de su categoría (frecuencia relativa).</p>

      <svg viewBox="0 0 200 200" width="100%" className="svg-grafico" role="img">
        <title>Gráfico circular de frecuencias</title>
        <desc>Porciones proporcionales a las frecuencias de las categorías A, B, C y D.</desc>
        {total > 0 &&
          porciones
            .filter((p) => p.fin > p.inicio)
            .map((p) => {
              // Una categoría con el 100 % degenera el arco (360° = 0°): se dibuja el disco completo.
              if (p.fin - p.inicio >= DOS_PI - 0.0001) {
                return <circle key={p.etiqueta} cx={CX} cy={CY} r={R} fill={p.color} />;
              }
              const a = punto(p.inicio);
              const b = punto(p.fin);
              const grande = p.fin - p.inicio > Math.PI ? 1 : 0;
              const d = `M ${CX} ${CY} L ${a.x} ${a.y} A ${R} ${R} 0 ${grande} 1 ${b.x} ${b.y} Z`;
              return <path key={p.etiqueta} d={d} fill={p.color} stroke="#ffffff" strokeWidth="2" />;
            })}
      </svg>

      <div className="campos-frecuencias">
        {CATEGORIAS.map((c, i) => (
          <label key={c} className="campo">
            {c}:
            <input
              type="number"
              min={0}
              value={frecuencias[i]}
              disabled={!listo}
              onChange={(e) => {
                const v = Math.max(0, Number(e.target.value) || 0);
                setFrecuencias((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
              aria-label={`Frecuencia de la categoría ${c}`}
            />
          </label>
        ))}
      </div>
      <p aria-live="polite">Total: {total}</p>
    </section>
  );
}
