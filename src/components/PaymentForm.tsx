import { useState } from "react";
import type { Debt } from "../hooks/useDebts";
import { getPendingAmount } from "../hooks/useDebts";

interface PaymentFormProps {
  debt: Debt;
  onSubmit: (
    amount: number,
    date: string,
    notes?: string
  ) => Promise<{ error: string | null; isSettled?: boolean }>;
  onCancel: () => void;
}

function PaymentForm({ debt, onSubmit, onCancel }: PaymentFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const pending = getPendingAmount(debt);

  const [amount, setAmount] = useState(pending.toFixed(2));
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }

    if (parsed > pending + 0.01) {
      setError(`No podés pagar más de $${pending.toFixed(2)}`);
      return;
    }

    setLoading(true);
    const { error: err } = await onSubmit(parsed, date, notes.trim() || undefined);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      onCancel();
    }
  }

  const isReceiving = debt.direction === "they_owe_me";

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="bg-bg-panel border-2 border-border-gold rounded-lg p-6 w-full max-w-md my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-pixel text-text-gold text-sm mb-2">
          💰 REGISTRAR PAGO
        </h2>
        <p className="text-text-secondary text-xs mb-4">
          {isReceiving
            ? `${debt.person_name} te devuelve`
            : `Le pagás a ${debt.person_name}`}
        </p>

        {/* Info de la deuda */}
        <div className="bg-bg-deep border border-border-dim rounded p-3 mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">Total</span>
            <span className="text-text-primary font-pixel">
              ${debt.amount_total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">Ya pagado</span>
            <span className="text-text-primary font-pixel">
              ${debt.amount_paid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs border-t border-border-dim pt-1 mt-1">
            <span className="text-text-secondary">Pendiente</span>
            <span className="text-accent-gold font-pixel">
              ${pending.toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs mb-1">
                MONTO
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={pending}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
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

          <div>
            <label className="block text-text-secondary text-xs mb-1">
              NOTAS <span className="text-text-secondary/60">(opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: pago parcial"
              maxLength={100}
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
            />
          </div>

          {/* Botones rápidos */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAmount(pending.toFixed(2))}
              className="flex-1 bg-bg-deep border border-border-dim text-text-secondary rounded px-2 py-1 text-xs hover:border-border-gold transition-all"
            >
              Pagar todo
            </button>
            <button
              type="button"
              onClick={() => setAmount((pending / 2).toFixed(2))}
              className="flex-1 bg-bg-deep border border-border-dim text-text-secondary rounded px-2 py-1 text-xs hover:border-border-gold transition-all"
            >
              Mitad
            </button>
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
              {loading ? "..." : "REGISTRAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;