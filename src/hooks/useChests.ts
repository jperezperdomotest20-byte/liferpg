import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Transaction } from "./useTransactions";

export interface Chest {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  percentage: number;
  balance: number;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChestColor {
  id: string;
  name: string;
  icon_path: string;
  border_color: string;
  sort_order: number;
}

export interface NewChest {
  name: string;
  icon: string;
  color: string;
  percentage: number;
}

export function useChests(transactions: Transaction[]) {
  const [chests, setChests] = useState<Chest[]>([]);
  const [colors, setColors] = useState<ChestColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [chestsRes, colorsRes] = await Promise.all([
      supabase
        .from("chests")
        .select("*")
        .eq("is_active", true)
        .order("percentage", { ascending: false }),
      supabase
        .from("chest_colors")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (chestsRes.error) {
      setError(chestsRes.error.message);
    } else {
      setChests(chestsRes.data ?? []);
    }

    if (!colorsRes.error) {
      setColors(colorsRes.data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addChest(input: NewChest) {
    const { data, error } = await supabase
      .from("chests")
      .insert(input)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return { error: error.message };
    }

    setChests((prev) =>
      [...prev, data].sort((a, b) => b.percentage - a.percentage)
    );
    return { error: null };
  }

  async function updateChest(id: string, input: NewChest) {
    const { data, error } = await supabase
      .from("chests")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return { error: error.message };
    }

    setChests((prev) =>
      prev
        .map((c) => (c.id === id ? data : c))
        .sort((a, b) => b.percentage - a.percentage)
    );
    return { error: null };
  }

  async function deleteChest(id: string) {
    const { error } = await supabase
      .from("chests")
      .update({ is_active: false, deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return { error: error.message };
    }

    setChests((prev) => prev.filter((c) => c.id !== id));
    return { error: null };
  }

  // Calcular saldos en vivo desde las transacciones
  const chestsWithBalance = chests.map((chest) => {
    const chestTransactions = transactions.filter(
      (t) => t.chest_id === chest.id
    );

    const income = chestTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = chestTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      ...chest,
      balance: income - expenses,
    };
  });

  const totalPercentage = chests.reduce((acc, c) => acc + c.percentage, 0);
  const availablePercentage = 100 - totalPercentage;

  return {
    chests: chestsWithBalance,
    colors,
    loading,
    error,
    addChest,
    updateChest,
    deleteChest,
    reload: load,
    totalPercentage,
    availablePercentage,
  };
}