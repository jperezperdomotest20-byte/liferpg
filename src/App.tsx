import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./supabaseClient";
import AuthView from "./components/AuthView";
import Header from "./components/Header";
import { Tabs, type TabId } from "./components/Tabs";
import ContableView from "./components/ContableView";
import InventarioView from "./components/InventarioView";
import MisionesView from "./components/MisionesView";

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("contable");

  // Mientras Supabase chequea si hay sesión, no mostramos nada
  // (evita parpadeo de Login → App al recargar)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-text-gold text-sm animate-pulse">
          CARGANDO...
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostramos pantalla de login/registro
  if (!user) {
    return <AuthView />;
  }

  // Si hay usuario, mostramos la app completa
  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <Header userEmail={user.email ?? ""} />

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main>
        {activeTab === "contable" && <ContableView />}
        {activeTab === "inventario" && <InventarioView />}
        {activeTab === "misiones" && <MisionesView />}
      </main>
    </div>
  );
}

export default App;