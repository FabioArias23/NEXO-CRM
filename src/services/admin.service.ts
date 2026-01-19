/* eslint-disable @typescript-eslint/no-explicit-any */

import { adminQueries } from "../client/queries/admin.queries";
import type {
  UserRole,
  AdminActivityLog,
  UserStat,
  AdminStats,
} from "../core/types";

export type { AdminActivityLog, UserStat, AdminStats };

export const adminService = {
  async getActivities(): Promise<AdminActivityLog[]> {
    const { data, error } = await adminQueries.getActivities();
    if (error) throw error;
    return (data || []) as AdminActivityLog[];
  },

  async getUserStats(): Promise<UserStat[]> {
    const { data, error } = await adminQueries.getUserStats();
    if (error) throw error;

    return (data || []).map((user: any) => ({
      userId: user.id,
      email: user.email,
      name: user.name || "Sin nombre",
      role: user.role || "employee",
      opportunitiesCount: user.opportunities?.[0]?.count || 0,
      activitiesCount: 0,
      totalValue: 0,
      wonDeals: 0,
      lastActive: user.created_at,
    }));
  },

  async getStats(): Promise<AdminStats> {
    const { data, error } = await adminQueries.getStats();
    if (error) throw error;
    return data!;
  },
};
