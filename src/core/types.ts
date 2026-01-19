





export type UserRole = "admin" | "employee";

export type OpportunityStage =
  | "Prospecto"
  | "Calificado"
  | "Propuesta"
  | "Negociación"
  | "Cerrado Ganado"
  | "Cerrado Perdido";

export type ActionType = "create" | "update" | "delete";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];


export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface OpportunityRow {
  id: string;
  name: string;
  company: string;
  contact: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  description: string | null;
  close_date: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
  last_modified_by: string | null;
}


export interface ActivityLogRow {
  id: string;
  user_id: string;
  action: ActionType;
  entity_type: string;
  entity_id: string;
  details: Json;
  created_at: string;
}


export interface Opportunity extends OpportunityRow {
  owner?: {
    name: string;
    email: string;
    role: UserRole;
  } | null;
  modifier?: {
    name: string;
    email: string;
  } | null;
}


export interface ActivityLog extends ActivityLogRow {
  users?: {
    name: string;
    email: string;
    role: UserRole;
  } | null;
}


export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: unknown;
  hint?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  activeOpportunities: number;
  conversionRate: number;
  averageValue: number;
  wonDeals?: number;
  totalUsers?: number;
}

export interface KPIMetrics {
  totalPremium: number;
  policyCount: number;
  claimsCount: number;
  renewalsCount: number;
  avgTicket: number;
}

export interface Renewal {
  id: number;
  client: string;
  clientName?: string;
  policy: string;
  type?: string;
  date: string;
  renewalDate?: string;
  amount: number;
  premium?: number;
  risk: "high" | "medium" | "low";
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: ActionType;
  entityType: string;
  entityId: string;
  entityName: string;
  timestamp: string;
  details: Json;
}

export interface UserStat {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  opportunitiesCount: number;
  activitiesCount: number;
  totalValue: number;
  wonDeals: number;
  lastActive: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOpportunities: number;
  totalRevenue: number;
  avgOpportunityValue: number;
  conversionRate: number;
  totalActivities: number;
  userStats: Array<{
    userId: string;
    email: string;
    name: string;
    opportunitiesCount: number;
    totalValue: number;
    activitiesCount: number;
  }>;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface ClientRecord {
  id: number;
  fechaCarga: string;
  caller: string;
  derivados: string;
  razonSocial: string;
  contacto: string;
  tel1: string;
  status: string;
  observaciones?: string;
  fechaAlta?: string;
  tel2?: string;
  [key: string]: any;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}


