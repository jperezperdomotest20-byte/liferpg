import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string | null;
  date: string;
  chest_id: string | null;    // ← NUEVO
  created_at: string;
}

export interface NewTransaction {
  type: "income" | "expense";
  amount: number;
  description: string;
  category?: string;
  date: string;
  chest_id?: string | null;   // ← NUEVO (opcional)
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addTransaction(input: NewTransaction) {
    const { data, error } = await supabase
      .from("transactions")
      .insert(input)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return { error: error.message };
    }

    // Insertamos el nuevo al principio (ya viene ordenado así desde el server)
    setTransactions((prev) => [data, ...prev]);
    return { error: null };
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return { error: error.message };
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return { error: null };
  }

  // Cálculos derivados
  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    reload: load,
    balance,
    totalIncome,
    totalExpenses,
  };
}