import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Opportunity {
  id: string;
  name: string;
  value: number;
  stage: string;
  company: string;
  contact: string;
  probability: number;
  closeDate: string;
  description?: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  lastModifiedBy: string;
  lastModifiedByEmail: string;
  lastModifiedByName: string;
  createdAt: string;
  updatedAt: string;
}

export function useOpportunities() {
  const { accessToken } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1db75c60/opportunities`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar oportunidades');
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const createOpportunity = async (opportunity: Partial<Opportunity>) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1db75c60/opportunities`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(opportunity),
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear oportunidad');
      }

      const data = await response.json();
      setOpportunities([...opportunities, data.opportunity]);
      return data.opportunity;
    } catch (err: any) {
      console.error('Error creating opportunity:', err);
      throw err;
    }
  };

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1db75c60/opportunities/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar oportunidad');
      }

      const data = await response.json();
      setOpportunities(
        opportunities.map((opp) => (opp.id === id ? data.opportunity : opp))
      );
      return data.opportunity;
    } catch (err: any) {
      console.error('Error updating opportunity:', err);
      throw err;
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1db75c60/opportunities/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar oportunidad');
      }

      setOpportunities(opportunities.filter((opp) => opp.id !== id));
    } catch (err: any) {
      console.error('Error deleting opportunity:', err);
      throw err;
    }
  };

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
