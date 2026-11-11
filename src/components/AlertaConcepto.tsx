type Props = { titulo?: string; texto: string };

export default function AlertaConcepto({ titulo = '¡Ojo!', texto }: Props) {
  return (
    <div className="alerta-concepto" role="note">
      <p className="alerta-titulo">{titulo}</p>
      <p>{texto}</p>
    </div>
  );
}
