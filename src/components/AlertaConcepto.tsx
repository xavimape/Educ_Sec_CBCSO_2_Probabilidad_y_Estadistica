type Props = { titulo?: string; texto: string };

export default function AlertaConcepto({ titulo = '¡Ojo!', texto }: Props) {
  return (
    <div className="alerta-concepto" role="note">
      <p className="alerta-titulo">
        <img
          className="alerta-ilustracion"
          src={`${import.meta.env.BASE_URL}ilustraciones/postit-ojo.png`}
          alt=""
          aria-hidden="true"
          width="24"
          height="24"
        />
        {titulo}
      </p>
      <p>{texto}</p>
    </div>
  );
}
