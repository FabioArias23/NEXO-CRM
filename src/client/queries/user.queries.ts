import { supabase } from "../supabase";

export const userQueries = {
  /**
   * Obtener perfil de usuario desde public.users (SEGURO)
   * Usa RLS para proteger acceso
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, is_active, created_at, updated_at")
        .eq("id", userId)
        .single();

      return { data, error };
    } catch (err) {
      // Si la tabla no existe, retornar null sin error
      return { data: null, error: null };
    }
  },

  /**
   * Actualizar perfil de usuario (solo nombre)
   * El role NO puede ser modificado aquí (protegido por RLS)
   */
  async updateUserProfile(userId: string, updates: { name?: string }) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Verificar si un usuario es admin
   * Lee desde public.users (NO desde user_metadata)
   */
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
