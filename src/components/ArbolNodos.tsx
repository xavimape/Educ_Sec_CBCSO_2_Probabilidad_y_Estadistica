import { useEffect, useState } from 'react';

type Hoja = { id: string; x: number; padre: 'C' | 'S' };

const HOJAS: Hoja[] = [
  { id: 'CC', x: 30, padre: 'C' },
  { id: 'CS', x: 90, padre: 'C' },
  { id: 'SC', x: 130, padre: 'S' },
  { id: 'SS', x: 190, padre: 'S' },
];

const Y_RAIZ = 20;
const Y_RAMA = 70;
const Y_HOJA = 130;
const X_C = 60;
const X_S = 160;

export default function ArbolNodos() {
  const [listo, setListo] = useState(false);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  useEffect(() => setListo(true), []);

  return (
    <section className="grafico">
      {!listo && <p className="aviso-hidratacion">Cargando la actividad… Si no responde en unos segundos, esta actividad necesita conexión la primera vez.</p>}
      <p>Árbol de dos lanzamientos: tocá o enfocá una hoja (Tab) para ver su probabilidad.</p>

      <svg viewBox="0 0 220 160" width="100%" className="svg-grafico" role="img">
        <title>Árbol de probabilidad de dos lanzamientos de moneda</title>
        <desc>Cuatro resultados posibles (CC, CS, SC y SS), cada uno con probabilidad un cuarto.</desc>

        <line x1="110" y1={Y_RAIZ} x2={X_C} y2={Y_RAMA} style={{ stroke: 'var(--color-tinta-suave)' }} strokeWidth="1.5" />
        <line x1="110" y1={Y_RAIZ} x2={X_S} y2={Y_RAMA} style={{ stroke: 'var(--color-tinta-suave)' }} strokeWidth="1.5" />
        <text x="105" y={Y_RAIZ - 5} fontSize="9" textAnchor="end">inicio</text>
        <text x={X_C} y={Y_RAMA - 5} fontSize="10" textAnchor="middle">C</text>
        <text x={X_S} y={Y_RAMA - 5} fontSize="10" textAnchor="middle">S</text>

        {HOJAS.map((h) => (
          <g key={h.id}>
            <line x1={h.padre === 'C' ? X_C : X_S} y1={Y_RAMA} x2={h.x} y2={Y_HOJA} style={{ stroke: 'var(--color-tinta-suave)' }} strokeWidth="1.5" />
            <g
              tabIndex={0}
              role="button"
              aria-label={`Resultado ${h.id}`}
              aria-pressed={seleccion === h.id}
              onClick={() => setSeleccion(h.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSeleccion(h.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={h.x}
                cy={Y_HOJA}
                r="9"
                style={{
                  fill: seleccion === h.id ? 'var(--color-acento)' : 'var(--color-fondo)',
                  stroke: 'var(--color-acento)',
                }}
                strokeWidth="1.5"
              />
              <text
                x={h.x}
                y={Y_HOJA + 3}
                fontSize="7"
                textAnchor="middle"
                style={{ fill: seleccion === h.id ? 'var(--color-superficie)' : 'var(--color-acento)' }}
              >
                {h.id}
              </text>
            </g>
          </g>
        ))}
      </svg>

      <p aria-live="polite">
        {seleccion ? `Elegiste ${seleccion}: P = 1/4.` : 'Ningún resultado elegido.'}
      </p>
    </section>
  );
}
