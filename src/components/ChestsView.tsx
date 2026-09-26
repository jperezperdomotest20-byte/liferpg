import type { Chest } from "../hooks/useChests";

interface ChestsViewProps {
  chests: Chest[];
  loading: boolean;
  error: string | null;
}

function ChestsView({ chests, loading, error }: ChestsViewProps) {
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

  if (chests.length === 0) {
    return (
      <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4">
        <h2 className="font-pixel text-text-gold text-sm mb-4">
          🏛️ SALA DEL TESORO
        </h2>
        <div className="text-text-secondary text-sm text-center py-8">
          📭 No hay cofres todavía.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-panel border-2 border-border-dim rounded-lg p-4 mb-4">
      <h2 className="font-pixel text-text-gold text-sm mb-4">
        🏛️ SALA DEL TESORO
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {chests.map((chest) => (
          <div
            key={chest.id}
            className="rounded-lg border-2 p-4 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: "#0a0a12",
              borderColor: chest.color,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{chest.icon}</span>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChestsView;