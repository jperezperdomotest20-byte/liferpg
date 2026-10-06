import { useState } from "react";
import {
  getPendingAmount,
  getProgress,
  type Debt,
} from "../hooks/useDebts";
import type { Chest } from "../hooks/useChests";

interface DebtsPanelProps {
  debts: Debt[];
  activeDebts: Debt[];
  settledDebts: Debt[];
  loading: boolean;
  error: string | null;
  totalTheyOweMe: number;
  totalIOweThem: number;
  chests: Chest[];
}

function DebtsPanel({
  debts,
  activeDebts,
  settledDebts,
  loading,
  error,
  totalTheyOweMe,
  totalIOweThem,
  chests,
}: DebtsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettled, setShowSettled] = useState(false);

  // Función helper: dada una deuda, devuelve el cofre asociado (si existe)
  function getChestForDebt(debt: Debt): Chest | undefined {
    if (!debt.chest_id) return undefined;
    return chests.find((c) => c.id === debt.chest_id);
  }

  // Agrupar deudas activas por persona
  const groupedActive = activeDebts.reduce<Record<string, Debt[]>>(
    (acc, debt) => {
      const key = debt.person_name.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(debt);
      return acc;
    },
    {}
  );

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div className="bg-bg-panel border-2 border-border-dim rounded-lg mb-4 overflow-hidden">
      {/* Header colapsable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-bg-panel-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-text-secondary text-xs">
            {isOpen ? "▼" : "▶"}
          </span>
          <h2 className="font-pixel text-text-gold text-sm">📜 DEUDAS</h2>
          {activeDebts.length > 0 && (
            <span className="bg-accent-ruby/30 text-accent-ruby font-pixel text-xs px-2 py-0.5 rounded">
              {activeDebts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          {totalTheyOweMe > 0 && (
            <div>
              <span className="text-text-secondary">Te deben: </span>
              <span className="text-accent-emerald font-pixel">
                ${totalTheyOweMe.toFixed(0)}
              </span>
            </div>
          )}
          {totalIOweThem > 0 && (
            <div>
              <span className="text-text-secondary">Debés: </span>
              <span className="text-accent-ruby font-pixel">
                ${totalIOweThem.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Contenido colapsable */}
      {isOpen && (
        <div className="border-t border-border-dim p-4">
          {loading && (
            <div className="text-text-secondary text-sm text-center py-4">
              Cargando deudas...
            </div>
          )}

          {error && (
            <div className="bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm">
              {error}
            </div>
          )}

          {!loading && activeDebts.length === 0 && debts.length === 0 && (
            <div className="text-text-secondary text-sm text-center py-6">
              📭 No hay deudas registradas todavía.
              <br />
              <span className="text-xs">
                (Próximamente: botón para crear deudas)
              </span>
            </div>
          )}

          {/* Deudas activas agrupadas por persona */}
          {Object.entries(groupedActive).map(([personKey, personDebts]) => {
            const personName = personDebts[0].person_name;
            const totalTheyOwe = personDebts
              .filter((d) => d.direction === "they_owe_me")
              .reduce((acc, d) => acc + getPendingAmount(d), 0);
            const totalIOwe = personDebts
              .filter((d) => d.direction === "i_owe_them")
              .reduce((acc, d) => acc + getPendingAmount(d), 0);

            return (
              <div
                key={personKey}
                className="mb-3 bg-bg-deep border border-border-dim rounded p-3"
              >
                {/* Nombre de la persona + totales */}
                <div className="flex justify-between items-center mb-2">
                  <div className="font-pixel text-text-primary text-xs">
                    👤 {personName.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {totalTheyOwe > 0 && (
                      <span className="text-accent-emerald">
                        +${totalTheyOwe.toFixed(2)}
                      </span>
                    )}
                    {totalIOwe > 0 && (
                      <span className="text-accent-ruby">
                        -${totalIOwe.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deudas de esa persona */}
                <div className="space-y-2">
                  {personDebts.map((debt) => {
                    const pending = getPendingAmount(debt);
                    const progress = getProgress(debt);
                    const chest = getChestForDebt(debt);

                    return (
                      <div
                        key={debt.id}
                        className="bg-bg-panel-light border border-border-dim rounded p-2"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <div className="text-text-primary text-sm">
                              {debt.description || "Sin descripción"}
                            </div>
                            <div className="text-text-secondary text-xs flex items-center gap-2 flex-wrap">
                              <span>
                                {debt.direction === "they_owe_me"
                                  ? "Te debe"
                                  : "Le debés"}
                              </span>
                              <span>·</span>
                              <span>{formatDate(debt.date_started)}</span>
                              {chest && (
                                <>
                                  <span>·</span>
                                  <img
                                    src={chest.icon}
                                    alt={chest.name}
                                    className="w-4 h-4 object-contain"
                                    style={{ imageRendering: "pixelated" }}
                                  />
                                  <span style={{ color: chest.color }}>
                                    {chest.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-pixel text-sm ${
                                debt.direction === "they_owe_me"
                                  ? "text-accent-emerald"
                                  : "text-accent-ruby"
                              }`}
                            >
                              ${pending.toFixed(2)}
                            </div>
                            {debt.amount_paid > 0 && (
                              <div className="text-text-secondary text-xs">
                                de ${debt.amount_total.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        {debt.amount_paid > 0 && (
                          <div className="mt-2">
                            <div className="w-full h-1.5 bg-bg-deep rounded overflow-hidden">
                              <div
                                className="h-full bg-accent-gold transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-text-secondary text-xs mt-1 text-right">
                              {progress.toFixed(0)}% pagado
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Sección de deudas saldadas (colapsable también) */}
          {settledDebts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border-dim">
              <button
                onClick={() => setShowSettled(!showSettled)}
                className="w-full flex justify-between items-center text-text-secondary text-xs hover:text-text-primary transition-colors"
              >
                <span>
                  {showSettled ? "▼" : "▶"} Historial ({settledDebts.length}{" "}
                  saldadas)
                </span>
              </button>

              {showSettled && (
                <div className="mt-3 space-y-2">
                  {settledDebts.map((debt) => (
                    <div
                      key={debt.id}
                      className="flex justify-between items-center bg-bg-deep rounded p-2 opacity-60"
                    >
                      <div>
                        <div className="text-text-primary text-sm">
                          {debt.person_name} -{" "}
                          {debt.description || "Sin descripción"}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {formatDate(debt.date_started)} · Saldada
                        </div>
                      </div>
                      <div className="font-pixel text-xs text-accent-emerald">
                        ✓ ${debt.amount_total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DebtsPanel;