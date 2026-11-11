import { useMemo, useState } from 'react';
import { contar, media, mediana, moda, acumuladas, formatearComa, parseDecimal } from '../lib/math';

type Fila = { valor: string; f: number; fr: number; pct: number; F?: number };

const EJEMPLOS: Record<string, string> = {
  'Libros (20 estudiantes)': '0\n1\n1\n2\n0\n1\n3\n2\n1\n4\n1\n2\n0\n1\n3\n2\n1\n2\n1\n0',
  'Sueldos (con extremo)': '300000\n300000\n300000\n300000\n2800000',
  'Colores (categorías)': 'azul\nrojo\nazul\nverde\namarillo\nrojo\nazul',
};

export default function Laboratorio() {
  const [texto, setTexto] = useState(EJEMPLOS['Libros (20 estudiantes)']);
  const [quitarExtremo, setQuitarExtremo] = useState(false);

  const { tipo, numeros, valores, total } = useMemo(() => analizar(texto), [texto]);
  const n = valores.length;
  const demasiados = total > 100;

  const conteo = useMemo(() => {
    if (tipo === 'numerico') {
      return contar(numeros).sort((a, b) => a.valor - b.valor);
    }
    return contar(valores.map(String));
  }, [tipo, numeros, valores]);

  const filas: Fila[] = conteo.map((c) => ({
    valor: String(c.valor),
    f: c.frecuencia,
    fr: c.frecuencia / n,
    pct: (c.frecuencia / n) * 100,
  }));

  if (tipo === 'numerico') {
    const F = acumuladas(filas.map((f) => f.f));
    filas.forEach((f, i) => {
      f.F = F[i];
    });
  }

  const mediaValor = tipo === 'numerico' ? media(numeros) : null;
  const medianaValor = tipo === 'numerico' ? mediana(numeros) : null;
  const modaValor = tipo === 'numerico' ? moda(numeros) : moda(valores.map(String));

  const sinExtremo =
    quitarExtremo && tipo === 'numerico' && numeros.length > 1
      ? (() => {
          const max = Math.max(...numeros);
          const idx = numeros.indexOf(max);
          return [...numeros.slice(0, idx), ...numeros.slice(idx + 1)];
        })()
      : null;

  return (
    <section className="lab">
      <label className="lab-campo">
        Datos (uno por línea):
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={6} aria-label="Datos, uno por línea" />
      </label>

      <div className="lab-botones">
        {Object.entries(EJEMPLOS).map(([nombre, valor]) => (
          <button key={nombre} type="button" onClick={() => setTexto(valor)}>{nombre}</button>
        ))}
        <button type="button" onClick={() => setTexto('')}>Limpiar</button>
      </div>

      {tipo === 'numerico' && numeros.length > 1 && (
        <label className="lab-check">
          <input type="checkbox" checked={quitarExtremo} onChange={(e) => setQuitarExtremo(e.target.checked)} />
          Quitar el valor mayor y comparar
        </label>
      )}

      {demasiados && <p className="feedback error">Hay más de 100 observaciones; se muestran las primeras 100.</p>}

      {n === 0 ? (
        <p>Ingresá al menos un dato.</p>
      ) : (
        <>
          <p className="lab-tipo">
            {tipo === 'numerico' ? 'Datos numéricos' : 'Datos categóricos'} · n = {n}
          </p>

          {tipo === 'numerico' && (
            <p>
              <strong>Ordenados:</strong> {[...numeros].sort((a, b) => a - b).map((x) => formatearComa(x)).join(', ')}
            </p>
          )}

          <table className="lab-tabla">
            <thead>
              <tr>
                <th>Valor</th>
                <th>f</th>
                <th>fr</th>
                <th>%</th>
                {tipo === 'numerico' && <th>F</th>}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.valor}>
                  <td>{fila.valor}</td>
                  <td>{fila.f}</td>
                  <td>{formatearComa(fila.fr, 4)}</td>
                  <td>{formatearComa(fila.pct, 2)} %</td>
                  {tipo === 'numerico' && <td>{fila.F}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          <GraficoBarras filas={filas} />

          <div className="lab-medidas">
            {tipo === 'numerico' ? (
              <>
                <p>Media: <strong>{mediaValor !== null ? formatearComa(mediaValor, 4) : '—'}</strong></p>
                <p>Mediana: <strong>{medianaValor !== null ? formatearComa(medianaValor, 4) : '—'}</strong></p>
              </>
            ) : (
              <p className="no-auto">Para categorías no se calculan media ni mediana (no son cantidades).</p>
            )}
            <p>Moda: <strong>{formatearModa(modaValor)}</strong></p>
          </div>

          {sinExtremo && (
            <div className="lab-comparador">
              <h2>Sin el valor mayor</h2>
              <p>Media: {formatearComa(media(sinExtremo) ?? NaN, 4)} (antes {mediaValor !== null ? formatearComa(mediaValor, 4) : '—'})</p>
              <p>Mediana: {formatearComa(mediana(sinExtremo) ?? NaN, 4)} (antes {medianaValor !== null ? formatearComa(medianaValor, 4) : '—'})</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function analizar(texto: string) {
  const todas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const lineas = todas.slice(0, 100);
  const valores: (string | number)[] = [];
  const numeros: number[] = [];
  for (const linea of lineas) {
    const n = parseDecimal(linea);
    if (n !== null) {
      valores.push(n);
      numeros.push(n);
    } else {
      valores.push(linea);
    }
  }
  const tipo = valores.length > 0 && numeros.length === valores.length ? 'numerico' : 'categorico';
  return { total: todas.length, valores, numeros, tipo: tipo as 'numerico' | 'categorico' };
}

function formatearModa(valor: (string | number)[] | null): string {
  if (!valor) return '—';
  if (valor.length === 0) return 'sin moda destacada';
  return valor.map((m) => (typeof m === 'number' ? formatearComa(m) : m)).join(' y ');
}

function GraficoBarras({ filas }: { filas: { valor: string; f: number }[] }) {
  const maxF = Math.max(1, ...filas.map((f) => f.f));
  const alto = 160;
  const anchoBarra = 44;
  const separacion = 12;
  const ancho = filas.length * (anchoBarra + separacion);
  return (
    <svg viewBox={`0 0 ${ancho} ${alto + 30}`} role="img" aria-label="Gráfico de barras de frecuencias" className="lab-svg">
      <line x1="0" y1={alto} x2={ancho} y2={alto} stroke="currentColor" strokeWidth="2" />
      {filas.map((f, i) => {
        const h = (f.f / maxF) * alto;
        const x = i * (anchoBarra + separacion);
        return (
          <g key={f.valor}>
            <rect x={x} y={alto - h} width={anchoBarra} height={h} style={{ fill: 'var(--color-acento)' }} />
            <text x={x + anchoBarra / 2} y={alto + 16} textAnchor="middle" fontSize="11">{f.valor}</text>
          </g>
        );
      })}
    </svg>
  );
}
