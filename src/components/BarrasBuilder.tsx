import { useEffect, useState } from 'react';

type Barra = { etiqueta: string; frecuencia: number };

// Datos verificados (G2-01): faltas de 15 alumnos, frecuencias 5, 6, 3, 1.
const DATOS: Barra[] = [
  { etiqueta: '0', frecuencia: 5 },
  { etiqueta: '1', frecuencia: 6 },
  { etiqueta: '2', frecuencia: 3 },
  { etiqueta: '3', frecuencia: 1 },
];

const MAX = 8;
const PX = 16; // píxeles por unidad (1 cuadrito = 1 unidad)

export default function BarrasBuilder() {
  const [listo, setListo] = useState(false);
  const [alturas, setAlturas] = useState<number[]>([0, 0, 0, 0]);
  const [total, setTotal] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [revisado, setRevisado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Marcar como hidratado para habilitar controles una vez que React esté listo
  useEffect(() => {
    setListo(true);
  }, []);

  const aciertos = DATOS.filter((d, i) => alturas[i] === d.frecuencia);
  const correcto = aciertos.length === DATOS.length && total.trim() === '15' && justificacion === 'mayor';

  function comprobar() {
    setRevisado(true);
    if (aciertos.length !== DATOS.length) {
      setMensaje('Revisá la altura de cada barra: debe coincidir con su frecuencia.');
      return;
    }
    if (total.trim() !== '15') {
      setMensaje('El total es la suma de las frecuencias: 5 + 6 + 3 + 1 = 15.');
      return;
    }
    if (justificacion !== 'mayor') {
      setMensaje('Elegí la explicación correcta: la altura representa la frecuencia.');
      return;
    }
    setMensaje('¡Correcto! Las cuatro barras, el total y la justificación están bien.');
  }

  return (
    <section className="actividad">
      <p>
        Tabla: faltas de 15 alumnos — frecuencias <strong>5, 6, 3 y 1</strong> para 0, 1, 2 y 3 faltas.
      </p>
      <p>Construí el gráfico: ajustá cada altura para que coincida con su frecuencia (1 unidad = 1 cuadrito).</p>

      <svg
        className="barras-svg"
        viewBox={`0 0 ${DATOS.length * 72} ${MAX * PX + 20}`}
        role="img"
        aria-label="Gráfico de barras que estás construyendo"
      >
        <line x1="0" y1={MAX * PX} x2={DATOS.length * 72} y2={MAX * PX} stroke="currentColor" strokeWidth="2" />
        {DATOS.map((d, i) => (
          <rect
            key={d.etiqueta}
            x={i * 72 + 8}
            y={MAX * PX - alturas[i] * PX}
            width={40}
            height={alturas[i] * PX}
            fill={revisado && alturas[i] === d.frecuencia ? '#16a34a' : '#1d4ed8'}
          />
        ))}
      </svg>

      <div className="barras-controles">
        {DATOS.map((d, i) => (
          <label key={d.etiqueta} className="barra-control">
            {d.etiqueta} faltas
            <input
              type="number"
              min={0}
              max={MAX}
              value={alturas[i]}
              disabled={!listo}
              onChange={(e) => {
                const v = Number(e.target.value);
                const alturasNuevas = [...alturas];
                alturasNuevas[i] = Number.isFinite(v) ? Math.max(0, Math.min(MAX, v)) : 0;
                setAlturas(alturasNuevas);
                setRevisado(false);
              }}
              aria-label={`Altura de la barra de ${d.etiqueta} faltas`}
            />
          </label>
        ))}
      </div>

      <label className="campo">
        Total de alumnos (suma de frecuencias):
        <input
          type="number"
          min={0}
          value={total}
          disabled={!listo}
          onChange={(e) => setTotal(e.target.value)}
          aria-label="Total de alumnos"
        />
      </label>

      <label className="campo">
        ¿Por qué la barra de «1 falta» es la más alta?
        <select
          value={justificacion}
          disabled={!listo}
          onChange={(e) => setJustificacion(e.target.value)}
          aria-label="Justificación de la barra más alta"
        >
          <option value="">Elegí una opción…</option>
          <option value="mayor">Porque 6 es la mayor frecuencia y la altura representa la frecuencia.</option>
          <option value="nombre">Porque «1 falta» es el rótulo más corto.</option>
          <option value="azar">Porque salió sorteado.</option>
        </select>
      </label>

      <button type="button" onClick={comprobar} disabled={!listo}>
        Comprobar
      </button>
      <p className="resultado" role="status">{mensaje}</p>
      {revisado && correcto && <p className="resultado ok">Todo correcto.</p>}
    </section>
  );
}
