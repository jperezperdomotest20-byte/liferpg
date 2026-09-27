import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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

export function useChests() {
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

  // Total de porcentajes repartidos (para validar)
  const totalPercentage = chests.reduce((acc, c) => acc + c.percentage, 0);
  const availablePercentage = 100 - totalPercentage;

  return {
    chests,
    colors,
    loading,
    error,
    addChest,
    reload: load,
    totalPercentage,
    availablePercentage,
  };
}