function InventarioView() {
  const items = [
    { id: 1, nombre: "Pegamento en barra", durabilidad: 80, ubicacion: "Cajón escritorio" },
    { id: 2, nombre: "Campera de invierno", durabilidad: 45, ubicacion: "Placard" },
    { id: 3, nombre: "Auriculares", durabilidad: 95, ubicacion: "Mochila" },
  ];

  const colorDurabilidad = (valor: number) => {
    if (valor > 70) return "bg-accent-emerald";
    if (valor > 30) return "bg-accent-gold";
    return "bg-accent-ruby";
  };

  return (
    <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4">
      <h2 className="font-pixel text-text-gold text-sm mb-4">
        🎒 INVENTARIO
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-bg-panel-light rounded p-3 border border-border-dim"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-primary">{item.nombre}</span>
              <span className="text-text-secondary text-xs">{item.ubicacion}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-bg-deep border border-border-dim rounded-sm overflow-hidden">
                <div
                  className={`h-full ${colorDurabilidad(item.durabilidad)}`}
                  style={{ width: `${item.durabilidad}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary font-pixel">
                {item.durabilidad}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InventarioView;