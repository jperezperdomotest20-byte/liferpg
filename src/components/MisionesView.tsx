function MisionesView() {
  const misiones = [
    { id: 1, titulo: "Ahorrar $500", progreso: 60, meta: 100, recompensa: "100 XP" },
    { id: 2, titulo: "Registrar gastos del mes", progreso: 15, meta: 30, recompensa: "50 XP" },
    { id: 3, titulo: "Organizar inventario", progreso: 0, meta: 1, recompensa: "200 XP" },
  ];

  return (
    <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4">
      <h2 className="font-pixel text-text-gold text-sm mb-4">
        ⚔️ MISIONES
      </h2>
      <ul className="space-y-2">
        {misiones.map((m) => {
          const porcentaje = (m.progreso / m.meta) * 100;
          return (
            <li
              key={m.id}
              className="bg-bg-panel-light rounded p-3 border border-border-dim"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-primary">{m.titulo}</span>
                <span className="text-text-gold text-xs font-pixel">
                  {m.recompensa}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-bg-deep border border-border-dim rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-accent-sapphire"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary">
                  {m.progreso}/{m.meta}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MisionesView;