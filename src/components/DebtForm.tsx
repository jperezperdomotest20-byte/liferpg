import { useState } from "react";
import type { NewDebt } from "../hooks/useDebts";
import type { Chest } from "../hooks/useChests";

interface DebtFormProps {
  chests: Chest[];
  onSubmit: (input: NewDebt) => Promise<{ error: string | null }>;
  onCancel: () => void;
}

function DebtForm({ chests, onSubmit, onCancel }: DebtFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [direction, setDirection] = useState<"they_owe_me" | "i_owe_them">(
    "they_owe_me"
  );
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [selectedChestId, setSelectedChestId] = useState<string | null>(
    chests[0]?.id ?? null
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!personName.trim()) {
      setError("El nombre de la persona es obligatorio");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("El monto debe ser un número mayor a 0");
      return;
    }

    if (!selectedChestId) {
      setError("Elegí un cofre para asociar la deuda");
      return;
    }

    setLoading(true);
    const { error: err } = await onSubmit({
      direction,
      person_name: personName.trim(),
      amount_total: parsedAmount,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      date_started: date,
      chest_id: selectedChestId,
    });
    setLoading(false);

    if (err) {
      setError(err);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="bg-bg-panel border-2 border-border-gold rounded-lg p-6 w-full max-w-lg my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-pixel text-text-gold text-sm mb-4">
          🤝 NUEVA DEUDA
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dirección */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              TIPO
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDirection("they_owe_me")}
                className={`flex-1 py-2 rounded border-2 text-xs font-pixel transition-all ${
                  direction === "they_owe_me"
                    ? "bg-accent-emerald/20 border-accent-emerald text-accent-emerald"
                    : "bg-bg-deep border-border-dim text-text-secondary"
                }`}
              >
                💰 ME DEBEN
              </button>
              <button
                type="button"
                onClick={() => setDirection("i_owe_them")}
                className={`flex-1 py-2 rounded border-2 text-xs font-pixel transition-all ${
                  direction === "i_owe_them"
                    ? "bg-accent-ruby/20 border-accent-ruby text-accent-ruby"
                    : "bg-bg-deep border-border-dim text-text-secondary"
                }`}
              >
                💸 DEBO
              </button>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              PERSONA
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Ej: Juan"
              maxLength={40}
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
            />
          </div>

          {/* Monto + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs mb-1">
                MONTO
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-1">
                FECHA
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              DESCRIPCIÓN <span className="text-text-secondary/60">(opcional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Almuerzo, cine..."
              maxLength={100}
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
            />
          </div>

          {/* Selector de cofre */}
          <div>
            <label className="block text-text-secondary text-xs mb-2">
              {direction === "they_owe_me"
                ? "¿DE QUÉ COFRE SALE EL PRÉSTAMO?"
                : "¿A QUÉ COFRE ENTRA EL PRÉSTAMO?"}
            </label>
            <div className="flex flex-wrap gap-2">
              {chests.map((chest) => {
                const isSelected = selectedChestId === chest.id;
                return (
                  <button
                    key={chest.id}
                    type="button"
                    onClick={() => setSelectedChestId(chest.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded border-2 transition-all ${
                      isSelected ? "scale-105" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: "#0a0a12",
                      borderColor: chest.color,
                    }}
                  >
                    <img
                      src={chest.icon}
                      alt={chest.name}
                      className="w-5 h-5 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span
                      className="font-pixel text-xs"
                      style={{ color: chest.color }}
                    >
                      {chest.name.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              NOTAS <span className="text-text-secondary/60">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Cualquier detalle extra..."
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-bg-deep border-2 border-border-dim text-text-secondary rounded py-2 font-pixel text-xs hover:border-border-gold transition-all"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-bg-deep border-2 border-border-gold text-text-gold rounded py-2 font-pixel text-xs hover:bg-bg-panel-light disabled:opacity-50 transition-all"
            >
              {loading ? "..." : "CREAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DebtForm;