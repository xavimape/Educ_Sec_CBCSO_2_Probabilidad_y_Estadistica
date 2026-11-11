export default function PasosConstruccion({ pasos }: { pasos: string[] }) {
  return (
    <ol className="pasos">
      {pasos.map((paso, i) => (
        <li key={i} className="paso">
          <span className="paso-numero" aria-hidden="true">{i + 1}</span>
          <span>{paso}</span>
        </li>
      ))}
    </ol>
  );
}
