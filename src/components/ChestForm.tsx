import { useState } from "react";
import type { ChestColor, NewChest } from "../hooks/useChests";

interface ChestFormProps {
  colors: ChestColor[];
  availablePercentage: number;
  onSubmit: (input: NewChest) => Promise<{ error: string | null }>;
  onCancel: () => void;
}

function ChestForm({
  colors,
  availablePercentage,
  onSubmit,
  onCancel,
}: ChestFormProps) {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [selectedColor, setSelectedColor] = useState<ChestColor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!selectedColor) {
      setError("Elegí un color para el cofre");
      return;
    }

    const parsedPercentage = parseFloat(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0) {
      setError("El porcentaje debe ser mayor a 0");
      return;
    }

    if (parsedPercentage > availablePercentage) {
      setError(
        `Solo te queda ${availablePercentage}% disponible. Ajustá el porcentaje.`
      );
      return;
    }

    setLoading(true);
    const { error: err } = await onSubmit({
      name: name.trim(),
      icon: selectedColor.icon_path,
      color: selectedColor.border_color,
      percentage: parsedPercentage,
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
          ✨ NUEVO COFRE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              NOMBRE
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Viajes"
              maxLength={30}
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
            />
          </div>

          {/* Porcentaje */}
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              PORCENTAJE DE CADA INGRESO
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="0"
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
            />
            <div className="text-text-secondary text-xs mt-1">
              Disponible: <span className="text-accent-gold font-pixel">{availablePercentage}%</span>
            </div>
          </div>

          {/* Selector de color */}
          <div>
            <label className="block text-text-secondary text-xs mb-2">
              COLOR
            </label>
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
              {colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`aspect-square rounded border-2 p-1 transition-all hover:scale-105 ${
                      isSelected
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{
                      borderColor: isSelected ? "#fff" : color.border_color,
                    }}
                    title={color.name}
                  >
                    <img
                      src={color.icon_path}
                      alt={color.name}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </button>
                );
              })}
            </div>
            {selectedColor && (
              <div className="text-text-secondary text-xs mt-2">
                Seleccionado: <span style={{ color: selectedColor.border_color }}>{selectedColor.name}</span>
              </div>
            )}
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

export default ChestForm;