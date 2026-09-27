import { useState } from "react";
import type { Chest, ChestColor, NewChest } from "../hooks/useChests";
import ChestForm from "./ChestForm";

interface ChestsViewProps {
  chests: Chest[];
  colors: ChestColor[];
  loading: boolean;
  error: string | null;
  availablePercentage: number;
  addChest: (input: NewChest) => Promise<{ error: string | null }>;
  updateChest: (
    id: string,
    input: NewChest
  ) => Promise<{ error: string | null }>;
  deleteChest: (id: string) => Promise<{ error: string | null }>;
}

function ChestsView({
  chests,
  colors,
  loading,
  error,
  availablePercentage,
  addChest,
  updateChest,
  deleteChest,
}: ChestsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingChest, setEditingChest] = useState<Chest | null>(null);

  function openCreate() {
    setEditingChest(null);
    setShowForm(true);
  }

  function openEdit(chest: Chest) {
    setEditingChest(chest);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingChest(null);
  }

  async function handleSubmit(input: NewChest) {
    const { error } = editingChest
      ? await updateChest(editingChest.id, input)
      : await addChest(input);
    if (!error) closeForm();
    return { error };
  }

  async function handleDelete() {
    if (!editingChest) return { error: "No hay cofre seleccionado" };
    const { error } = await deleteChest(editingChest.id);
    if (!error) closeForm();
    return { error };
  }

  if (loading) {
    return (
      <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4">
        <h2 className="font-pixel text-text-gold text-sm mb-4">
          🏛️ SALA DEL TESORO
        </h2>
        <div className="text-text-secondary text-sm text-center py-4">
          Cargando cofres...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4">
        <h2 className="font-pixel text-text-gold text-sm mb-4">
          🏛️ SALA DEL TESORO
        </h2>
        <div className="bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-text-gold text-sm">
            🏛️ SALA DEL TESORO
          </h2>
          <button
            onClick={openCreate}
            className="bg-bg-deep border-2 border-border-gold text-text-gold rounded px-3 py-1.5 font-pixel text-xs hover:bg-bg-panel-light transition-all"
          >
            ➕ NUEVO
          </button>
        </div>

        {chests.length === 0 ? (
          <div className="text-text-secondary text-sm text-center py-8">
            📭 No hay cofres todavía. Creá el primero.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {chests.map((chest) => (
              <button
                key={chest.id}
                onClick={() => openEdit(chest)}
                className="rounded-lg border-2 p-4 transition-all hover:scale-[1.02] text-left cursor-pointer"
                style={{
                  backgroundColor: "#0a0a12",
                  borderColor: chest.color,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <img
                    src={chest.icon}
                    alt={chest.name}
                    className="w-14 h-14 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span
                    className="text-xs font-pixel opacity-60"
                    style={{ color: chest.color }}
                  >
                    {chest.percentage}%
                  </span>
                </div>

                <div
                  className="font-pixel text-xs mb-2"
                  style={{ color: chest.color }}
                >
                  {chest.name.toUpperCase()}
                </div>

                <div className="text-text-primary font-pixel text-base">
                  ${chest.balance.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ChestForm
          colors={colors}
          availablePercentage={availablePercentage}
          chest={editingChest ?? undefined}
          onSubmit={handleSubmit}
          onDelete={editingChest ? handleDelete : undefined}
          onCancel={closeForm}
        />
      )}
    </>
  );
}

export default ChestsView;