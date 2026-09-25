function ContableView() {
  const movimientos = [
    { id: 1, tipo: "gasto", desc: "Supermercado", monto: 45, fecha: "2025-01-15" },
    { id: 2, tipo: "ingreso", desc: "Sueldo", monto: 800, fecha: "2025-01-01" },
    { id: 3, tipo: "gasto", desc: "Internet", monto: 30, fecha: "2025-01-10" },
  ];

  return (
    <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4">
      <h2 className="font-pixel text-text-gold text-sm mb-4">
        📜 LIBRO CONTABLE
      </h2>
      <ul className="space-y-2">
        {movimientos.map((m) => (
          <li
            key={m.id}
            className="flex justify-between items-center bg-bg-panel-light rounded p-3 border border-border-dim"
          >
            <div>
              <div className="text-text-primary">{m.desc}</div>
              <div className="text-text-secondary text-xs">{m.fecha}</div>
            </div>
            <div
              className={`font-pixel text-sm ${
                m.tipo === "ingreso"
                  ? "text-accent-emerald"
                  : "text-accent-ruby"
              }`}
            >
              {m.tipo === "ingreso" ? "+" : "-"}${m.monto}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContableView;