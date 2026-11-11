type Props = { error: string; acierto: string; explicacion?: string };

export default function Comparativa({ error, acierto, explicacion }: Props) {
  return (
    <div className="comparativa">
      <div className="comparativa-col comparativa-error">
        <p className="comparativa-marca" aria-hidden="true">❌</p>
        <p>{error}</p>
      </div>
      <div className="comparativa-col comparativa-acierto">
        <p className="comparativa-marca" aria-hidden="true">✅</p>
        <p>{acierto}</p>
      </div>
      {explicacion && <p className="comparativa-exp">{explicacion}</p>}
    </div>
  );
}
