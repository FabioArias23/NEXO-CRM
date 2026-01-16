import { supabase } from "../supabase";

export const adminQueries = {
  /**
   * Obtener logs de actividad del sistema
   * Requiere: RLS configurado para que solo admins puedan leer
   */
  async getActivities() {
    const { data, error } = await supabase
      .from("activity_logs")
      .select(
        `
        *,
        users(name, email, role)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(100);

    return { data, error };
  },

  /**
   * Obtener estadísticas de usuarios con sus oportunidades
   * Usa JOIN entre users y opportunities
   */
  async getUserStats() {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        name,
        role,
        opportunities:opportunities(count),
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    return { data, error };
  },

  /**
   * Obtener estadísticas globales del sistema
   * Combina múltiples queries
   */
  async getStats() {
    const [usersResult, oppsResult] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("opportunities").select(
        `
        id,
        value,
        stage,
        probability
      `,
      ),
    ]);

    if (usersResult.error) throw usersResult.error;
    if (oppsResult.error) throw oppsResult.error;

    const opportunities = oppsResult.data || [];
    const totalUsers = usersResult.count || 0;
    const totalOpportunities = opportunities.length;
    const totalRevenue = opportunities
      .filter((o) => o.stage === "Cerrado Ganado")
      .reduce((sum, o) => sum + (o.value || 0), 0);
    const avgOpportunityValue =
      totalOpportunities > 0
        ? opportunities.reduce((sum, o) => sum + (o.value || 0), 0) /
          totalOpportunities
        : 0;
    const wonDeals = opportunities.filter(
      (o) => o.stage === "Cerrado Ganado",
    ).length;
    const conversionRate =
      totalOpportunities > 0 ? (wonDeals / totalOpportunities) * 100 : 0;

    return {
      data: {
        totalUsers,
        totalOpportunities,
        totalRevenue,
        avgOpportunityValue,
        conversionRate,
        totalActivities: 0,
        userStats: [],
      },
      error: null,
    };
  },
};
