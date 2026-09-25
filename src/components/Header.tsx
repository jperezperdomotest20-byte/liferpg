function Header() {
  // Datos falsos por ahora. Después vienen de la base de datos.
  const dinero = 1250;
  const nivel = 3;
  const xpActual = 320;
  const xpSiguiente = 500;
  const racha = 7;

  const porcentajeXP = (xpActual / xpSiguiente) * 100;

  return (
    <header className="bg-bg-panel border-2 border-border-gold rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Dinero */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-pixel text-text-gold text-lg">
            ${dinero.toLocaleString()}
          </span>
        </div>

        {/* Nivel y racha */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <div>
              <div className="text-text-secondary text-xs">NIVEL</div>
              <div className="font-pixel text-text-primary text-sm">{nivel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-text-secondary text-xs">RACHA</div>
              <div className="font-pixel text-text-primary text-sm">{racha}d</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de XP */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-secondary">EXPERIENCIA</span>
          <span className="text-text-gold font-pixel">
            {xpActual} / {xpSiguiente}
          </span>
        </div>
        <div className="w-full h-4 bg-bg-deep border-2 border-border-dim rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent-emerald transition-all duration-500"
            style={{ width: `${porcentajeXP}%` }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;