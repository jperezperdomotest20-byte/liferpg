import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export interface Debt {
  id: string;
  user_id: string;
  direction: "they_owe_me" | "i_owe_them";
  person_name: string;
  amount_total: number;
  amount_paid: number;
  description: string | null;
  notes: string | null;
  date_started: string;
  date_closed: string | null;
  status: "active" | "settled" | "cancelled";
  chest_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewDebt {
  direction: "they_owe_me" | "i_owe_them";
  person_name: string;
  amount_total: number;
  description?: string;
  notes?: string;
  date_started: string;
  chest_id?: string | null;
}

export interface DebtPayment {
  id: string;
  user_id: string;
  debt_id: string;
  amount: number;
  date: string;
  notes: string | null;
  created_at: string;
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .order("status", { ascending: true }) // active primero, después settled, cancelled
      .order("date_started", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setDebts(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Cálculos derivados
  const activeDebts = debts.filter((d) => d.status === "active");
  const settledDebts = debts.filter((d) => d.status === "settled");
  const cancelledDebts = debts.filter((d) => d.status === "cancelled");

  // Totales (solo activas)
  const totalTheyOweMe = activeDebts
    .filter((d) => d.direction === "they_owe_me")
    .reduce((acc, d) => acc + (d.amount_total - d.amount_paid), 0);

  const totalIOweThem = activeDebts
    .filter((d) => d.direction === "i_owe_them")
    .reduce((acc, d) => acc + (d.amount_total - d.amount_paid), 0);

  return {
    debts,
    activeDebts,
    settledDebts,
    cancelledDebts,
    loading,
    error,
    reload: load,
    totalTheyOweMe,
    totalIOweThem,
  };
}

// Helpers exportados para usar en componentes
export function getPendingAmount(debt: Debt): number {
  return debt.amount_total - debt.amount_paid;
}

export function getProgress(debt: Debt): number {
  if (debt.amount_total === 0) return 0;
  return (debt.amount_paid / debt.amount_total) * 100;
}