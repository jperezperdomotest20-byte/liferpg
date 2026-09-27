import type { Transaction, NewTransaction } from "../hooks/useTransactions";
import type { Chest } from "../hooks/useChests";
import TransactionForm from "./TransactionForm";

interface ContableViewProps {
  transactions: Transaction[];
  chests: Chest[];
  loading: boolean;
  error: string | null;
  addTransaction: (input: NewTransaction) => Promise<{ error: string | null }>;
  deleteTransaction: (id: string) => Promise<{ error: string | null }>;
}

function ContableView({
  transactions,
  chests,
  loading,
  error,
  addTransaction,
  deleteTransaction,
}: ContableViewProps) {
  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div>
      <TransactionForm chests={chests} onSubmit={addTransaction} />

      <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4">
        <h2 className="font-pixel text-text-gold text-sm mb-4">
          📜 LIBRO CONTABLE
        </h2>

        {loading && (
          <div className="text-text-secondary text-sm text-center py-4">
            Cargando...
          </div>
        )}

        {error && (
          <div className="bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm mb-3">
            {error}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-text-secondary text-sm text-center py-8">
            📭 No hay transacciones todavía.
            <br />
            Registrá la primera arriba.
          </div>
        )}

        <ul className="space-y-2">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-bg-panel-light rounded p-3 border border-border-dim group"
            >
              <div className="flex-1">
                <div className="text-text-primary">{t.description}</div>
                <div className="text-text-secondary text-xs">
                  {formatDate(t.date)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`font-pixel text-sm ${
                    t.type === "income"
                      ? "text-accent-emerald"
                      : "text-accent-ruby"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </div>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-text-secondary hover:text-accent-ruby transition-colors opacity-0 group-hover:opacity-100 text-lg"
                  title="Borrar"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContableView;