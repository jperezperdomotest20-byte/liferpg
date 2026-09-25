import { supabase } from "../supabaseClient";

interface HeaderProps {
  userEmail: string;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

function Header({ userEmail, balance, totalIncome, totalExpenses }: HeaderProps) {
  <span className="font-pixel text-text-gold text-lg">
  ${balance.toLocaleString()}
</span>

  const nivel = 3;
  const xpActual = 320;
  const xpSiguiente = 500;
  const racha = 7;

  const porcentajeXP = (xpActual / xpSiguiente) * 100;

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="bg-bg-panel border-2 border-border-gold rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-pixel text-text-gold text-lg">
            ${balance.toLocaleString()}
          </span>
        </div>
        <div className="text-text-secondary text-xs mt-1">
  <span className="text-accent-emerald">+${totalIncome.toFixed(0)}</span>
  {" · "}
  <span className="text-accent-ruby">-${totalExpenses.toFixed(0)}</span>
</div>

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

      <div className="mt-4 flex justify-between items-center border-t border-border-dim pt-3">
        <span className="text-text-secondary text-xs">
          🧙 {userEmail}
        </span>
        <button
          onClick={handleLogout}
          className="text-text-secondary text-xs hover:text-accent-ruby transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;