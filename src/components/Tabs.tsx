import { useRef, useState } from 'react';

export type Item = { titulo: string; contenido: string };

export default function Tabs({ items }: { items: Item[] }) {
  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  if (items.length === 0) return null;

  const mover = (delta: number) => {
    const nuevo = (activo + delta + items.length) % items.length;
    setActivo(nuevo);
    refs.current[nuevo]?.focus();
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
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="tabs-boton"
            onClick={() => setActivo(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                mover(1);
              }
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                mover(-1);
              }
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
