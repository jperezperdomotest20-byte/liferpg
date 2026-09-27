import { useState } from "react";
import type { NewTransaction } from "../hooks/useTransactions";
import type { Chest } from "../hooks/useChests";

interface TransactionFormProps {
  chests: Chest[];
  onSubmit: (input: NewTransaction) => Promise<{ error: string | null }>;
}

function TransactionForm({ chests, onSubmit }: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [selectedChestId, setSelectedChestId] = useState<string | null>(
    chests[0]?.id ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("El monto debe ser un número mayor a 0");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (type === "expense" && !selectedChestId) {
      setError("Elegí un cofre de donde sale el gasto");
      return;
    }

    setLoading(true);
    const { error: err } = await onSubmit({
      type,
      amount: parsedAmount,
      description: description.trim(),
      date,
      chest_id: type === "expense" ? selectedChestId : null,
    });
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setAmount("");
    setDescription("");
    setDate(today);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4"
    >
      <h2 className="font-pixel text-text-gold text-xs mb-4">
        ✍️ NUEVA TRANSACCIÓN
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Tipo */}
        <div className="md:col-span-1">
          <label className="block text-text-secondary text-xs mb-1">TIPO</label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded border-2 text-xs font-pixel transition-all ${
                type === "expense"
                  ? "bg-accent-ruby/20 border-accent-ruby text-accent-ruby"
                  : "bg-bg-deep border-border-dim text-text-secondary"
              }`}
            >
              GASTO
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded border-2 text-xs font-pixel transition-all ${
                type === "income"
                  ? "bg-accent-emerald/20 border-accent-emerald text-accent-emerald"
                  : "bg-bg-deep border-border-dim text-text-secondary"
              }`}
            >
              INGRESO
            </button>
          </div>
        </div>

        {/* Monto */}
        <div>
          <label className="block text-text-secondary text-xs mb-1">MONTO</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-1">
          <label className="block text-text-secondary text-xs mb-1">
            DESCRIPCIÓN
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Ej: Supermercado"
            className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-text-secondary text-xs mb-1">FECHA</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Selector de cofre (solo para gastos) */}
      {type === "expense" && chests.length > 0 && (
        <div className="mt-4">
          <label className="block text-text-secondary text-xs mb-2">
            ¿DE QUÉ COFRE SALE?
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
                    className="w-6 h-6 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span
                    className="font-pixel text-xs"
                    style={{ color: chest.color }}
                  >
                    {chest.name.toUpperCase()}
                  </span>
                  <span
                    className="font-pixel text-xs opacity-70"
                    style={{ color: chest.color }}
                  >
                    ${chest.balance.toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Aviso de ingresos (todavía no se reparten) */}
      {type === "income" && (
        <div className="mt-4 bg-accent-sapphire/10 border border-accent-sapphire/30 rounded p-3 text-text-secondary text-xs">
          ℹ️ La repartición automática de ingresos viene en la próxima sesión.
          Por ahora, los ingresos se registran como total general.
        </div>
      )}

      {error && (
        <div className="mt-3 bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-bg-deep border-2 border-border-gold text-text-gold rounded py-2 font-pixel text-xs hover:bg-bg-panel-light disabled:opacity-50 transition-all"
      >
        {loading ? "GUARDANDO..." : "➕ REGISTRAR"}
      </button>
    </form>
  );
}

export default TransactionForm;