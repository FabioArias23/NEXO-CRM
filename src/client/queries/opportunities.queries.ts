import { supabase } from "../supabase";
import type { Opportunity, OpportunityRow } from "../../core/types";

export const opportunitiesQueries = {
  async getAll(userId: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from("opportunities")
      .select(
        `
        *,
        owner:users!owner_id(name, email, role)
      `,
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllForAdmin(): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from("opportunities")
      .select(
        `
        *,
        owner:users!owner_id(name, email, role),
        modifier:users!last_modified_by(name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Opportunity> {
    const { data, error } = await supabase
      .from("opportunities")
      .select(
        `
        *,
        owner:users!owner_id(name, email, role)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(opportunity: Partial<OpportunityRow>): Promise<Opportunity> {
    const { data: result, error } = await supabase
      .from("opportunities")
      .insert([opportunity])
      .select(
        `
        *,
        owner:users!owner_id(name, email, role)
      `,
      )
      .single();

    if (error) throw error;
    return result;
  },

  async update(
    id: string,
    updates: Partial<OpportunityRow>,
  ): Promise<Opportunity> {
    const { data, error } = await supabase
      .from("opportunities")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        owner:users!owner_id(name, email, role)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  onChanges(userId: string, callback: (opp: Opportunity) => void) {
    const channel = supabase
      .channel("opportunities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "opportunities",
          filter: `owner_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) callback(payload.new as Opportunity);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
