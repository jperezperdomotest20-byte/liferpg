import { useMemo, useState } from "react";
import type {
  GroupedTransactionInput,
  NewTransaction,
} from "../hooks/useTransactions";
import type { Chest } from "../hooks/useChests";

interface TransactionFormProps {
  chests: Chest[];
  onSubmit: (input: NewTransaction) => Promise<{ error: string | null }>;
  onSubmitGroup: (
    input: GroupedTransactionInput
  ) => Promise<{ error: string | null }>;
}

function TransactionForm({
  chests,
  onSubmit,
  onSubmitGroup,
}: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [selectedChestId, setSelectedChestId] = useState<string | null>(
    chests[0]?.id ?? null
  );
  const [distributeAutomatically, setDistributeAutomatically] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Total de porcentajes (para validar)
  const totalPercentage = chests.reduce((acc, c) => acc + c.percentage, 0);
  const percentagesValid = Math.abs(totalPercentage - 100) < 0.01;

  // Vista previa de la repartición
  const preview = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    if (
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      type !== "income" ||
      !distributeAutomatically
    ) {
      return [];
    }

    return chests
      .filter((c) => c.percentage > 0)
      .map((chest) => ({
        chest,
        amount: (parsedAmount * chest.percentage) / 100,
      }));
  }, [amount, type, distributeAutomatically, chests]);

  // Cuánto queda sin asignar (si los porcentajes no suman 100)
  const unassignedAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    if (
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      type !== "income" ||
      !distributeAutomatically
    ) {
      return 0;
    }
    const assigned = preview.reduce((acc, p) => acc + p.amount, 0);
    return parsedAmount - assigned;
  }, [amount, type, distributeAutomatically, preview]);

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

    // Validaciones según tipo
    if (type === "expense" && !selectedChestId) {
      setError("Elegí un cofre de donde sale el gasto");
      return;
    }

    if (
      type === "income" &&
      distributeAutomatically &&
      !percentagesValid
    ) {
      setError(
        `Los porcentajes suman ${totalPercentage}%. Ajustalos a 100% antes de repartir.`
      );
      return;
    }

    if (type === "income" && !distributeAutomatically && !selectedChestId) {
      setError("Elegí a qué cofre va el ingreso");
      return;
    }

    setLoading(true);

    // GASTO: transacción simple
    if (type === "expense") {
      const { error: err } = await onSubmit({
        type: "expense",
        amount: parsedAmount,
        description: description.trim(),
        date,
        chest_id: selectedChestId,
      });
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
    }
    // INGRESO repartido: grupo de transacciones
    else if (distributeAutomatically) {
      const parts = preview.map((p) => ({
        amount: p.amount,
        chest_id: p.chest.id,
      }));

      // Si sobra algo sin asignar, agregamos una parte con chest_id = null
      if (unassignedAmount > 0.01) {
        parts.push({
          amount: unassignedAmount,
          chest_id: null,
        });
      }

      const { error: err } = await onSubmitGroup({
        type: "income",
        description: description.trim(),
        date,
        parts,
      });
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
    }
    // INGRESO específico: transacción simple con cofre
    else {
      const { error: err } = await onSubmit({
        type: "income",
        amount: parsedAmount,
        description: description.trim(),
        date,
        chest_id: selectedChestId,
      });
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
    }

    // Reset
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

      {/* Toggle de repartición (solo ingresos) */}
      {type === "income" && chests.length > 0 && (
        <div className="mt-4 flex items-center gap-3 bg-bg-deep border-2 border-border-dim rounded p-3">
          <button
            type="button"
            onClick={() => setDistributeAutomatically(!distributeAutomatically)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              distributeAutomatically ? "bg-accent-emerald" : "bg-border-dim"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                distributeAutomatically ? "left-6" : "left-0.5"
              }`}
            />
          </button>
          <div className="flex-1">
            <div className="text-text-primary text-xs font-pixel">
              REPARTIR SEGÚN PORCENTAJES
            </div>
            <div className="text-text-secondary text-xs">
              {distributeAutomatically
                ? "El ingreso se reparte entre los cofres"
                : "Todo el ingreso va a un solo cofre"}
            </div>
          </div>
        </div>
      )}

      {/* Aviso de porcentajes inválidos */}
      {type === "income" &&
        distributeAutomatically &&
        chests.length > 0 &&
        !percentagesValid && (
          <div className="mt-3 bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-xs">
            ⚠️ Los porcentajes suman {totalPercentage}%. Ajustalos a 100% para
            poder repartir.
          </div>
        )}

      {/* Vista previa de la repartición */}
      {type === "income" &&
        distributeAutomatically &&
        preview.length > 0 && (
          <div className="mt-3 bg-bg-deep border-2 border-border-dim rounded p-3">
            <div className="text-text-secondary text-xs mb-2 font-pixel">
              📊 VISTA PREVIA
            </div>
            <div className="space-y-1">
              {preview.map((p) => (
                <div
                  key={p.chest.id}
                  className="flex justify-between items-center text-xs"
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={p.chest.icon}
                      alt={p.chest.name}
                      className="w-5 h-5 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span style={{ color: p.chest.color }}>
                      {p.chest.name}
                    </span>
                    <span className="text-text-secondary">
                      ({p.chest.percentage}%)
                    </span>
                  </span>
                  <span className="text-text-primary font-pixel">
                    ${p.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {unassignedAmount > 0.01 && (
                <div className="flex justify-between items-center text-xs border-t border-border-dim pt-1 mt-1">
                  <span className="text-text-secondary italic">
                    Sin asignar
                  </span>
                  <span className="text-text-secondary font-pixel">
                    ${unassignedAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Selector de cofre (gastos O ingresos sin repartir) */}
      {(type === "expense" ||
        (type === "income" && !distributeAutomatically)) &&
        chests.length > 0 && (
          <div className="mt-4">
            <label className="block text-text-secondary text-xs mb-2">
              {type === "expense"
                ? "¿DE QUÉ COFRE SALE?"
                : "¿A QUÉ COFRE VA?"}
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