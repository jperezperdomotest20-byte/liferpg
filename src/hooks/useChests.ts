import { useEffect, useState } from "react";
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

export function useChests() {
  const [chests, setChests] = useState<Chest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("chests")
        .select("*")
        .eq("is_active", true)
        .order("percentage", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setChests(data ?? []);
      }
      setLoading(false);
    }

    load();
  }, []);

  return { chests, loading, error };
}