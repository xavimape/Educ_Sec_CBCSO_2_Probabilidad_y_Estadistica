import { useState } from 'react';

type Props = { contenido: string; titulo?: string };

export default function Colapsable({ contenido, titulo = 'Ver respuesta' }: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="colapsable">
      <button
        type="button"
        className="colapsable-boton"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        {abierto ? 'Ocultar respuesta' : titulo}
      </button>
      {abierto && <div className="colapsable-panel">{contenido}</div>}
    </div>
  );
}
