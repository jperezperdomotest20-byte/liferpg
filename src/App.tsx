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
  async function leerTransacciones() {
    console.log(">>> Consultando transacciones...");
    const { data, error } = await supabase
      .from("transactions")
      .select("*");

    if (error) {
      console.error("Error al leer:", error);
      return;
    }

    console.log("Transacciones leídas:", data);
    console.log("Cantidad:", data?.length ?? 0);
  }

  leerTransacciones();
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