import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Header from "./components/Header";
import { Tabs, type TabId } from "./components/Tabs";
import ContableView from "./components/ContableView";
import InventarioView from "./components/InventarioView";
import MisionesView from "./components/MisionesView";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("contable");

  useEffect(() => {
    console.log(">>> useEffect corrió");
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Cliente Supabase:", supabase);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <Header />
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