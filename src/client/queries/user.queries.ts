import { supabase } from "../supabase";

export const userQueries = {
  
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, is_active, created_at, updated_at")
        .eq("id", userId)
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: null };
    }
  },

  
  async updateUserProfile(userId: string, updates: { name?: string }) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  },

  
  async isUserAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .eq("is_active", true)
      .single();

    if (error || !data) return false;
    return data.role === "admin";
  },
};


