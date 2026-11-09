import { useEffect, useMemo, useState } from 'react';
import { corregir, type Parte, type Resultado } from '../lib/corrector';
import { cargarProgreso, guardarProgreso, marcarEjercicio, alternarRepasar } from '../lib/storage';

type EjercicioDatos = {
  id: string;
  titulo: string;
  modulo: string;
  nivel: string;
  origen: string;
  habilidades: string[];
  enunciado: string;
  partes: Parte[];
  pistas: string[];
  solucion: string[];
  etiquetas: string[];
};

export default function Ejercicio({ ejercicio }: { ejercicio: string }) {
  const datos = useMemo(() => JSON.parse(ejercicio) as EjercicioDatos, [ejercicio]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [resultados, setResultados] = useState<Record<string, Resultado>>({});
  const [pistasVisibles, setPistasVisibles] = useState(0);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);
  const [revisado, setRevisado] = useState(false);
  const [repasar, setRepasar] = useState(false);

  function responder(id: string, valor: string) {
    setRespuestas((prev) => ({ ...prev, [id]: valor }));
    setRevisado(false);
  }

  function comprobar() {
    const nuevos: Record<string, Resultado> = {};
    for (const parte of datos.partes) {
      nuevos[parte.id] = corregir(parte, respuestas[parte.id] ?? '');
    }
    setResultados(nuevos);
    setRevisado(true);
  }

  function reintentar() {
    setRespuestas({});
    setResultados({});
    setRevisado(false);
    setMostrarSolucion(false);
    setPistasVisibles(0);
  }

  function alternarRepaso() {
    const p = cargarProgreso();
    guardarProgreso(alternarRepasar(p, datos.id));
    setRepasar((r) => !r);
  }

  const todoCorrecto = revisado && datos.partes.every((p) => resultados[p.id]?.correcto === true);
  const usoAyuda = pistasVisibles > 0 || mostrarSolucion;

  useEffect(() => {
    setRepasar(cargarProgreso().repasar.includes(datos.id));
  }, [datos.id]);

  useEffect(() => {
    if (revisado && todoCorrecto) {
      const p = cargarProgreso();
      guardarProgreso(marcarEjercicio(p, datos.id, usoAyuda ? 'resuelto_con_ayuda' : 'resuelto_sin_ayuda'));
    }
  }, [revisado, todoCorrecto, datos.id, usoAyuda]);

  return (
    <section className="ejercicio">
      <header className="ejercicio-cabecera">
        <span className="badge">{datos.nivel}</span>
        <span className="badge">{datos.origen}</span>
        <h1>{datos.titulo}</h1>
      </header>

      <p className="enunciado">{datos.enunciado}</p>

      <ol className="partes">
        {datos.partes.map((parte) => (
          <li key={parte.id} className="parte">
            {parte.label && <p className="label">{parte.label}</p>}
            <ParteCampo parte={parte} valor={respuestas[parte.id] ?? ''} onChange={(v) => responder(parte.id, v)} />
            {revisado && resultados[parte.id] && (
              <p className={resultados[parte.id].correcto === true ? 'feedback ok' : 'feedback error'} role="status">
                {resultados[parte.id].mensaje}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="controles">
        <button type="button" onClick={comprobar}>Comprobar</button>
        <button type="button" onClick={reintentar}>Volver a intentar</button>
        <button type="button" onClick={alternarRepaso} aria-pressed={repasar}>
          {repasar ? 'Quitar de repasar' : 'Marcar para repasar'}
        </button>
      </div>

      {todoCorrecto && <p className="feedback ok" role="status">¡Todo correcto!</p>}

      {datos.pistas.length > 0 && (
        <div className="pistas">
          <p><strong>Pistas</strong> {pistasVisibles > 0 ? `(${pistasVisibles} de ${datos.pistas.length})` : ''}</p>
          {datos.pistas.slice(0, pistasVisibles).map((p, i) => (
            <p key={i} className="pista">{p}</p>
          ))}
          {pistasVisibles < datos.pistas.length && (
            <button type="button" onClick={() => setPistasVisibles((n) => n + 1)}>Mostrar una pista</button>
          )}
        </div>
      )}

      <div className="solucion">
        {!mostrarSolucion ? (
          <button type="button" onClick={() => setMostrarSolucion(true)}>Ver solución</button>
        ) : (
          <ol>{datos.solucion.map((s, i) => <li key={i}>{s}</li>)}</ol>
        )}
      </div>
    </section>
  );
}

function ParteCampo({ parte, valor, onChange }: { parte: Parte; valor: string; onChange: (v: string) => void }) {
  if (parte.tipo === 'select') {
    return (
      <select value={valor} onChange={(e) => onChange(e.target.value)}>
        <option value="">Elegí una opción…</option>
        {(parte.opciones ?? []).map((o) => (
          <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
        ))}
      </select>
    );
  }
  if (parte.tipo === 'rubrica' || parte.tipo === 'tabla' || parte.tipo === 'barras') {
    return <p className="no-auto">Esta parte se resuelve aparte y se revisa con la rúbrica o la tabla.</p>;
  }
  return (
    <input
      type="text"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      aria-label={parte.label ?? parte.id}
    />
  );
}
