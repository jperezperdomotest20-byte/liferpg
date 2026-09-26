import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTransactions } from "./hooks/useTransactions";
import { useChests } from "./hooks/useChests";
import AuthView from "./components/AuthView";
import Header from "./components/Header";
import { Tabs, type TabId } from "./components/Tabs";
import ChestsView from "./components/ChestsView";
import ContableView from "./components/ContableView";
import InventarioView from "./components/InventarioView";
import MisionesView from "./components/MisionesView";

function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("contable");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-text-gold text-sm animate-pulse">
          CARGANDO...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <AuthenticatedApp
      userEmail={user.email ?? ""}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

function AuthenticatedApp({
  userEmail,
  activeTab,
  setActiveTab,
}: {
  userEmail: string;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
}) {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    balance,
    totalIncome,
    totalExpenses,
  } = useTransactions();

  const {
    chests,
    loading: chestsLoading,
    error: chestsError,
  } = useChests();

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <Header
        userEmail={userEmail}
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main>
        {activeTab === "contable" && (
          <>
            <ChestsView
              chests={chests}
              loading={chestsLoading}
              error={chestsError}
            />
            <ContableView
              transactions={transactions}
              loading={loading}
              error={error}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
            />
          </>
        )}
        {activeTab === "inventario" && <InventarioView />}
        {activeTab === "misiones" && <MisionesView />}
      </main>
    </div>
  );
}

export default App;