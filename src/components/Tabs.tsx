import { useState } from 'react';

export type Item = { titulo: string; contenido: string };

export default function Tabs({ items }: { items: Item[] }) {
  const [activo, setActivo] = useState(0);
  if (items.length === 0) return null;

  const mover = (delta: number) => {
    setActivo((i) => (i + delta + items.length) % items.length);
  };

  return (
    <div className="tabs">
      <div role="tablist" className="tabs-lista">
        {items.map((item, i) => (
          <button
            key={item.titulo}
            type="button"
            role="tab"
            aria-selected={activo === i}
            tabIndex={activo === i ? 0 : -1}
            className="tabs-boton"
            onClick={() => setActivo(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') mover(1);
              if (e.key === 'ArrowLeft') mover(-1);
            }}
          >
            {item.titulo}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={item.titulo} role="tabpanel" className="tabs-panel" hidden={activo !== i}>
          {item.contenido}
        </div>
      ))}
    </div>
  );
}
