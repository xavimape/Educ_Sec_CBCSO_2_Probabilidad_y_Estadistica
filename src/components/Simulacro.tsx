import { useMemo, useState } from 'react';
import { corregir, type Parte, type Resultado } from '../lib/corrector';
import { mulberry32 } from '../lib/math';

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

type Fase = 'config' | 'intento' | 'resultado';

export default function Simulacro({ ejercicios }: { ejercicios: string }) {
  const banco = useMemo(() => JSON.parse(ejercicios) as EjercicioDatos[], [ejercicios]);
  const [fase, setFase] = useState<Fase>('config');
  const [cantidad, setCantidad] = useState<8 | 12>(8);
  const [semilla, setSemilla] = useState(1);
  const [seleccion, setSeleccion] = useState<EjercicioDatos[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, Record<string, string>>>({});
  const [resultados, setResultados] = useState<Record<string, Record<string, Resultado>>>({});

  function iniciar() {
    setSeleccion(seleccionar(banco, cantidad, semilla));
    setRespuestas({});
    setResultados({});
    setIndice(0);
    setFase('intento');
  }

  function responder(ejId: string, parteId: string, valor: string) {
    setRespuestas((prev) => ({ ...prev, [ejId]: { ...prev[ejId], [parteId]: valor } }));
  }

  function finalizar() {
    const res: Record<string, Record<string, Resultado>> = {};
    for (const ej of seleccion) {
      res[ej.id] = {};
      for (const parte of ej.partes) {
        res[ej.id][parte.id] = corregir(parte, respuestas[ej.id]?.[parte.id] ?? '');
      }
    }
    setResultados(res);
    setFase('resultado');
  }

  function volver() {
    setFase('config');
    setSeleccion([]);
  }

  if (fase === 'config') {
    return (
      <section className="sim-config">
        <p>El simulacro es práctica, no una nota oficial. Elegí cuántos ejercicios y una semilla.</p>
        <label className="campo">
          Cantidad:
          <select value={cantidad} onChange={(e) => setCantidad(Number(e.target.value) as 8 | 12)}>
            <option value={8}>8 ejercicios (repaso breve, 2 por tema)</option>
            <option value={12}>12 ejercicios (repaso completo, 3 por tema)</option>
          </select>
        </label>
        <label className="campo">
          Semilla (mismo número → mismo simulacro):
          <input type="number" value={semilla} onChange={(e) => setSemilla(Number(e.target.value) || 1)} />
        </label>
        <button type="button" onClick={iniciar}>Comenzar</button>
      </section>
    );
  }

  if (fase === 'intento') {
    const actual = seleccion[indice];
    return (
      <section className="ejercicio">
        <p className="progreso">Ejercicio {indice + 1} de {seleccion.length}</p>
        <header className="ejercicio-cabecera">
          <span className="badge">{actual.nivel}</span>
          <span className="badge">{actual.modulo}</span>
          <h1>{actual.titulo}</h1>
        </header>
        <p className="enunciado">{actual.enunciado}</p>
        <ol className="partes">
          {actual.partes.map((parte) => (
            <li key={parte.id} className="parte">
              {parte.label && <p className="label">{parte.label}</p>}
              <CampoParte
                parte={parte}
                valor={respuestas[actual.id]?.[parte.id] ?? ''}
                onChange={(v) => responder(actual.id, parte.id, v)}
              />
            </li>
          ))}
        </ol>
        <div className="controles">
          <button type="button" disabled={indice === 0} onClick={() => setIndice((i) => i - 1)}>Anterior</button>
          {indice < seleccion.length - 1 ? (
            <button type="button" onClick={() => setIndice((i) => i + 1)}>Siguiente</button>
          ) : (
            <button type="button" onClick={finalizar}>Finalizar</button>
          )}
        </div>
        <p className="nota">Sin pistas ni solución hasta el final.</p>
      </section>
    );
  }

  // resultado
  let correctos = 0;
  let incorrectos = 0;
  let autoevaluacion = 0;
  for (const ej of seleccion) {
    for (const parte of ej.partes) {
      const r = resultados[ej.id]?.[parte.id];
      if (r?.correcto === true) correctos += 1;
      else if (r?.correcto === false) incorrectos += 1;
      else autoevaluacion += 1;
    }
  }

  return (
    <section className="sim-resultado">
      <h1>Resultado</h1>
      <p>Correctas: {correctos} · Incorrectas: {incorrectos} · Para autoevaluar: {autoevaluacion}</p>
      <p className="nota">Esto es práctica, no una nota oficial. Las partes de rúbrica, tabla o gráfico se autoevalúan con sus criterios.</p>

      {seleccion.map((ej) => (
        <article key={ej.id} className="resumen-ejercicio">
          <h2>{ej.titulo}</h2>
          <ol className="partes">
            {ej.partes.map((parte) => {
              const r = resultados[ej.id]?.[parte.id];
              const clase = r?.correcto === true ? 'ok' : r?.correcto === false ? 'error' : 'auto';
              return (
                <li key={parte.id} className="parte">
                  {parte.label && <p className="label">{parte.label}</p>}
                  <p className={`feedback ${clase}`}>
                    {r?.correcto === true ? '✓ Correcto' : r?.correcto === false ? '✗ ' + (r.mensaje ?? 'Incorrecto') : '· Se autoevalúa con la rúbrica'}
                  </p>
                </li>
              );
            })}
          </ol>
          <details>
            <summary>Ver solución</summary>
            <ol>{ej.solucion.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </details>
        </article>
      ))}

      <button type="button" onClick={volver}>Volver a configurar</button>
    </section>
  );
}

function CampoParte({ parte, valor, onChange }: { parte: Parte; valor: string; onChange: (v: string) => void }) {
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

function seleccionar(banco: EjercicioDatos[], cantidad: number, semilla: number): EjercicioDatos[] {
  const rand = mulberry32(semilla);
  const porModulo = new Map<string, EjercicioDatos[]>();
  for (const e of banco) {
    const lista = porModulo.get(e.modulo) ?? [];
    lista.push(e);
    porModulo.set(e.modulo, lista);
  }
  for (const [m, lista] of porModulo) {
    porModulo.set(m, mezclar(lista, rand));
  }
  const modulos = [...porModulo.keys()].sort();
  const porTema = cantidad === 12 ? 3 : 2;
  const resultado: EjercicioDatos[] = [];
  for (let pasada = 0; pasada < porTema && resultado.length < cantidad; pasada++) {
    for (const m of modulos) {
      if (resultado.length >= cantidad) break;
      const lista = porModulo.get(m)!;
      if (pasada < lista.length) resultado.push(lista[pasada]);
    }
  }
  return resultado.slice(0, cantidad);
}

function mezclar<T>(arr: T[], rand: () => number): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
