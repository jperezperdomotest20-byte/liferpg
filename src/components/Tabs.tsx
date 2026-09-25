import { useState } from "react";

type TabId = "contable" | "inventario" | "misiones";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "contable", label: "Contable", icon: "📜" },
  { id: "inventario", label: "Inventario", icon: "🎒" },
  { id: "misiones", label: "Misiones", icon: "⚔️" },
];

interface TabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <nav className="flex gap-2 mb-4">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 py-3 px-4 rounded-lg border-2 transition-all
              font-pixel text-xs
              ${
                isActive
                  ? "bg-bg-panel border-border-gold text-text-gold"
                  : "bg-bg-panel/50 border-border-dim text-text-secondary hover:border-border-gold hover:text-text-primary"
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export { Tabs };
export type { TabId };