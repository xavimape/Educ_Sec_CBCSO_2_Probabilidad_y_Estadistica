import { useEffect, useState } from 'react';

const HOJAS = ['CC', 'CS', 'SC', 'SS'];
const FAVORABLES = new Set(['CC', 'CS', 'SC']);

export default function ArbolProbabilidad() {
  const [listo, setListo] = useState(false);
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [total, setTotal] = useState('');
  const [favorables, setFavorables] = useState('');
  const [probabilidad, setProbabilidad] = useState('');
  const [revisado, setRevisado] = useState(false);
  const [correcto, setCorrecto] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setListo(true);
  }, []);

  const seleccionCorrecta = HOJAS.every((h) => seleccion.includes(h) === FAVORABLES.has(h));

  function alternar(hoja: string) {
    setSeleccion((prev) => (prev.includes(hoja) ? prev.filter((h) => h !== hoja) : [...prev, hoja]));
    setRevisado(false);
  }

  function comprobar() {
    setRevisado(true);
    setCorrecto(false);
    if (!seleccionCorrecta) {
      setMensaje('Marcá los tres resultados con al menos una cara: CC, CS y SC.');
      return;
    }
    if (total.trim() !== '4') {
      setMensaje('Hay 4 resultados posibles en total (dos lanzamientos).');
      return;
    }
    if (favorables.trim() !== '3') {
      setMensaje('Los resultados favorables son 3: CC, CS y SC.');
      return;
    }
    const p = probabilidad.trim().replace(/\s/g, '');
    if (!['3/4', '0,75', '0.75', '75%', '75'].includes(p)) {
      setMensaje('La probabilidad es 3 ÷ 4 = 0,75. Escribila como 3/4, 0,75 o 75 %.');
      return;
    }
    setCorrecto(true);
    setMensaje('¡Correcto! P(al menos una cara) = 3/4.');
  }

  return (
    <section className="actividad">
      <p>
        Se lanza una moneda dos veces. Marcá los resultados con <strong>al menos una cara</strong> y calculá la probabilidad.
      </p>

      <fieldset className="arbol">
        <legend>Resultados posibles</legend>
        <div className="hojas">
          {HOJAS.map((hoja) => (
            <button
              key={hoja}
              type="button"
              className="hoja"
              disabled={!listo}
              aria-pressed={seleccion.includes(hoja)}
              onClick={() => alternar(hoja)}
            >
              {hoja}
            </button>
          ))}
        </div>
        <p aria-live="polite">Favorables marcados: {seleccion.length}</p>
      </fieldset>

      <div className="campos">
        <label className="campo">
          Total de resultados posibles:
          <input
            type="number"
            min={0}
            value={total}
            disabled={!listo}
            onChange={(e) => setTotal(e.target.value)}
            aria-label="Total de resultados posibles"
          />
        </label>
        <label className="campo">
          Resultados favorables:
          <input
            type="number"
            min={0}
            value={favorables}
            disabled={!listo}
            onChange={(e) => setFavorables(e.target.value)}
            aria-label="Resultados favorables"
          />
        </label>
        <label className="campo">
          P(al menos una cara):
          <input
            type="text"
            value={probabilidad}
            disabled={!listo}
            onChange={(e) => setProbabilidad(e.target.value)}
            aria-label="Probabilidad de al menos una cara"
          />
        </label>
      </div>

      <button type="button" onClick={comprobar} disabled={!listo}>
        Comprobar
      </button>
      <p className="resultado" role="status">{mensaje}</p>
      {revisado && correcto && <p className="resultado ok">Todo correcto.</p>}
    </section>
  );
}
