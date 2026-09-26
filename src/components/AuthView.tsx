import { useState } from "react";
import { supabase } from "../supabaseClient";

type Mode = "login" | "register";

function AuthView() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Registro exitoso: mostramos aviso de "revisá tu email"
        setMessage(
          `Te enviamos un email a ${email}. Revisá tu bandeja (y spam) para confirmar tu cuenta.`
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setMessage(null);
    setPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-panel border-2 border-border-gold rounded-lg p-6">
        <h1 className="font-pixel text-text-gold text-center text-lg mb-2">
          LIFERPG
        </h1>
        <p className="text-text-secondary text-center text-sm mb-6">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </p>

        {message && (
          <div className="mb-4 bg-accent-gold/20 border-2 border-accent-gold rounded-lg p-3 flex items-start gap-3">
            <span className="text-xl">📧</span>
            <div className="flex-1">
              <div className="text-accent-gold text-xs font-pixel">
                REVISÁ TU EMAIL
              </div>
              <div className="text-text-secondary text-xs mt-1">{message}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-bg-deep border-2 border-border-dim rounded px-3 py-2 text-text-primary focus:border-border-gold focus:outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <div className="bg-accent-ruby/20 border border-accent-ruby rounded px-3 py-2 text-accent-ruby text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bg-deep border-2 border-border-gold text-text-gold rounded py-3 font-pixel text-xs hover:bg-bg-panel-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? "..."
              : mode === "login"
              ? "🔓 INICIAR SESIÓN"
              : "✨ CREAR CUENTA"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-text-secondary text-xs hover:text-text-gold transition-colors"
          >
            {mode === "login"
              ? "¿No tenés cuenta? Crear una"
              : "¿Ya tenés cuenta? Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthView;