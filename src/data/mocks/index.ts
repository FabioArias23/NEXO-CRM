import dashboardData from './dashboard.json';
import consultoriaData from './consultoria.json';
import crmData from './crm.json';
import usersData from './users.json';

export const mockData = {
  dashboard: dashboardData,
  consultoria: consultoriaData,
  crm: crmData,
  users: usersData,
};

export type { KPIMetrics, Renewal } from '../../hooks/useDashboardData';
export type { ClientRecord } from '../../components/modals/RecordDrawer';


