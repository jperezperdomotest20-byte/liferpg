import { useState } from "react";
import type {
  Transaction,
  NewTransaction,
  GroupedTransactionInput,
} from "../hooks/useTransactions";
import type { Chest } from "../hooks/useChests";
import TransactionForm from "./TransactionForm";

interface ContableViewProps {
  transactions: Transaction[];
  chests: Chest[];
  loading: boolean;
  error: string | null;
  addTransaction: (input: NewTransaction) => Promise<{ error: string | null }>;
  addTransactionGroup: (
    input: GroupedTransactionInput
  ) => Promise<{ error: string | null }>;
  deleteTransaction: (id: string) => Promise<{ error: string | null }>;
}

function ContableView({
  transactions,
  chests,
  loading,
  error,
  addTransaction,
  addTransactionGroup,
  deleteTransaction,
}: ContableViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  type ListItem =
    | { kind: "single"; transaction: Transaction }
    | { kind: "group"; groupId: string; transactions: Transaction[] };

  const items: ListItem[] = [];
  const seenGroups = new Set<string>();

  for (const tx of transactions) {
    if (tx.group_id) {
      if (seenGroups.has(tx.group_id)) continue;
      seenGroups.add(tx.group_id);
      const groupTxs = transactions.filter((t) => t.group_id === tx.group_id);
      items.push({
        kind: "group",
        groupId: tx.group_id,
        transactions: groupTxs,
      });
    } else {
      items.push({ kind: "single", transaction: tx });
    }
  }

  return (
    <div>
      <TransactionForm
        chests={chests}
        onSubmit={addTransaction}
        onSubmitGroup={addTransactionGroup}
      />

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
          {items.map((item) => {
            if (item.kind === "single") {
              const t = item.transaction;
              const chest = chests.find((c) => c.id === t.chest_id);

              return (
                <li
                  key={t.id}
                  className="flex justify-between items-center bg-bg-panel-light rounded p-3 border border-border-dim group"
                >
                  <div className="flex-1">
                    <div className="text-text-primary">{t.description}</div>
                    <div className="text-text-secondary text-xs flex items-center gap-2">
                      <span>{formatDate(t.date)}</span>
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
              );
            }

            // Grupo
            const isExpanded = expandedGroups.has(item.groupId);
            const total = item.transactions.reduce(
              (acc, t) => acc + t.amount,
              0
            );
            const firstTx = item.transactions[0];

            return (
              <li
                key={item.groupId}
                className="bg-bg-panel-light rounded border border-border-dim overflow-hidden"
              >
                <div className="flex justify-between items-center p-3 group">
                  <button
                    onClick={() => toggleGroup(item.groupId)}
                    className="flex-1 flex items-center gap-2 text-left"
                  >
                    <span className="text-text-secondary text-xs">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <div>
                      <div className="text-text-primary">
                        {firstTx.description}
                      </div>
                      <div className="text-text-secondary text-xs">
                        {formatDate(firstTx.date)} ·{" "}
                        {item.transactions.length} cofres
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="font-pixel text-sm text-accent-emerald">
                      +${total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => deleteTransaction(firstTx.id)}
                      className="text-text-secondary hover:text-accent-ruby transition-colors opacity-0 group-hover:opacity-100 text-lg"
                      title="Borrar grupo"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border-dim bg-bg-deep p-3 space-y-2">
                    {item.transactions.map((t) => {
                      const chest = chests.find((c) => c.id === t.chest_id);
                      return (
                        <div
                          key={t.id}
                          className="flex justify-between items-center text-xs"
                        >
                          <span className="flex items-center gap-2">
                            {chest ? (
                              <>
                                <img
                                  src={chest.icon}
                                  alt={chest.name}
                                  className="w-5 h-5 object-contain"
                                  style={{ imageRendering: "pixelated" }}
                                />
                                <span style={{ color: chest.color }}>
                                  {chest.name}
                                </span>
                              </>
                            ) : (
                              <span className="text-text-secondary italic">
                                Sin asignar
                              </span>
                            )}
                          </span>
                          <span className="text-text-primary font-pixel">
                            +${t.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ContableView;