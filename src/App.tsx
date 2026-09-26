import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTransactions } from "./hooks/useTransactions";
import AuthView from "./components/AuthView";
import Header from "./components/Header";
import { Tabs, type TabId } from "./components/Tabs";
import ContableView from "./components/ContableView";
import InventarioView from "./components/InventarioView";
import MisionesView from "./components/MisionesView";

function App() {
  const { user, loading: authLoading, isEmailVerified } = useAuth();
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
    isEmailVerified={isEmailVerified}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
  />
);
}

function AuthenticatedApp({
  userEmail,
  isEmailVerified,
  activeTab,
  setActiveTab,
}: {
  userEmail: string;
  isEmailVerified: boolean;
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

  return (
  <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
    <Header
      userEmail={userEmail}
      balance={balance}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
    />

    {!isEmailVerified && (
      <div className="bg-accent-gold/20 border-2 border-accent-gold rounded-lg p-3 mb-4 flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <div className="text-accent-gold text-xs font-pixel">
            VERIFICÁ TU EMAIL
          </div>
          <div className="text-text-secondary text-xs mt-1">
            Te enviamos un link a {userEmail}. Revisá tu bandeja (y spam).
          </div>
        </div>
      </div>
    )}

    <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main>
        {activeTab === "contable" && (
          <ContableView
            transactions={transactions}
            loading={loading}
            error={error}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
          />
        )}
        {activeTab === "inventario" && <InventarioView />}
        {activeTab === "misiones" && <MisionesView />}
      </main>
    </div>
  );
}

export default App;