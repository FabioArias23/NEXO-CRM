
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { opportunitiesService } from "../services/opportunities.service";
import { type Opportunity } from "../core/types";

export function useOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await opportunitiesService.getAll(user.id);
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOpportunities();
    if (!user) return;
    const unsubscribe = opportunitiesService.onChanges(user.id, (opp) => {
      setOpportunities((prev) => {
        const idx = prev.findIndex((o) => o.id === opp.id);
        if (idx > -1) {
          prev[idx] = opp;
          return [...prev];
        }
        return [opp, ...prev];
      });
    });

    return unsubscribe;
  }, [user?.id, fetchOpportunities]);

  const createOpportunity = useCallback(
    async (
      data: Omit<
        Opportunity,
        | "id"
        | "created_at"
        | "updated_at"
        | "owner_id"
        | "last_modified_by"
        | "owner"
        | "modifier"
      >,
    ) => {
      if (!user) throw new Error("Usuario no autenticado");

      const opp = await opportunitiesService.create(user.id, data);
      setOpportunities((prev) => [opp, ...prev]);
      return opp;
    },
    [user],
  );

  const updateOpportunity = useCallback(
    async (id: string, updates: Partial<Opportunity>) => {
      if (!user) throw new Error("Usuario no autenticado");

      const opp = await opportunitiesService.update(id, user.id, updates);
      setOpportunities((prev) => prev.map((o) => (o.id === id ? opp : o)));
      return opp;
    },
    [user],
  );

  const deleteOpportunity = useCallback(async (id: string) => {
    await opportunitiesService.delete(id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return {
    opportunities,
    loading,
    error,
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  };
}


