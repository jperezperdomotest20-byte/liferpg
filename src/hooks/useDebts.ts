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
  chest_id: string | null;
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
      .order("status", { ascending: true })
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

  // Crear deuda + transacción vinculada
  // Devuelve el debt_id para que App pueda refrescar transacciones
  async function addDebt(input: NewDebt) {
    // 1. Crear la deuda
    const { data: debt, error: debtError } = await supabase
      .from("debts")
      .insert({
        direction: input.direction,
        person_name: input.person_name,
        amount_total: input.amount_total,
        description: input.description,
        notes: input.notes,
        date_started: input.date_started,
        chest_id: input.chest_id,
      })
      .select()
      .single();

    if (debtError || !debt) {
      setError(debtError?.message ?? "Error creando deuda");
      return { error: debtError?.message ?? "Error creando deuda" };
    }

    // 2. Crear la transacción vinculada
    const transactionType = input.direction === "they_owe_me" ? "expense" : "income";
    const description =
      input.direction === "they_owe_me"
        ? `Préstamo a ${input.person_name}`
        : `Préstamo de ${input.person_name}`;

    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        type: transactionType,
        amount: input.amount_total,
        description,
        date: input.date_started,
        chest_id: input.chest_id,
        related_debt_id: debt.id,
      });

    if (txError) {
      // Si falla la transacción, borramos la deuda para no dejar huérfana
      await supabase.from("debts").delete().eq("id", debt.id);
      setError(txError.message);
      return { error: txError.message };
    }

    setDebts((prev) => [debt, ...prev]);
    return { error: null, debtId: debt.id };
  }

  const activeDebts = debts.filter((d) => d.status === "active");
  const settledDebts = debts.filter((d) => d.status === "settled");
  const cancelledDebts = debts.filter((d) => d.status === "cancelled");

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
    addDebt,
    totalTheyOweMe,
    totalIOweThem,
  };
}

export function getPendingAmount(debt: Debt): number {
  return debt.amount_total - debt.amount_paid;
}

export function getProgress(debt: Debt): number {
  if (debt.amount_total === 0) return 0;
  return (debt.amount_paid / debt.amount_total) * 100;
}