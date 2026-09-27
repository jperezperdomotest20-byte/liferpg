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
  chest_id: string | null;
  group_id: string | null;
  created_at: string;
}

export interface NewTransaction {
  type: "income" | "expense";
  amount: number;
  description: string;
  category?: string;
  date: string;
  chest_id?: string | null;
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

    setTransactions((prev) => [data, ...prev]);
    return { error: null };
  }

  async function deleteTransaction(id: string) {
    // Si la transacción pertenece a un grupo, borramos TODAS las del grupo
    const { data: tx } = await supabase
      .from("transactions")
      .select("group_id")
      .eq("id", id)
      .single();

    if (tx?.group_id) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("group_id", tx.group_id);

      if (error) {
        setError(error.message);
        return { error: error.message };
      }

      setTransactions((prev) =>
        prev.filter((t) => t.group_id !== tx.group_id)
      );
    } else {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        setError(error.message);
        return { error: error.message };
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }

    return { error: null };
  }

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