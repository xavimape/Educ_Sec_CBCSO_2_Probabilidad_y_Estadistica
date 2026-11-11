import { useState } from 'react';

type Props = { titulo: string; contenido: string };

export default function Acordeon({ titulo, contenido }: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="acordeon">
      <button
        type="button"
        className="acordeon-boton"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <span>{titulo}</span>
        <span className="acordeon-icono" aria-hidden="true">
          {abierto ? '−' : '+'}
        </span>
      </button>
      {abierto && <div className="acordeon-panel">{contenido}</div>}
    </div>
  );
}
