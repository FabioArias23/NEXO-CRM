import { useState, useMemo } from "react";
import dashboardMockData from "../data/mocks/dashboard.json";
import type { KPIMetrics, Renewal } from "../core/types";

export type { KPIMetrics, Renewal };

export function useDashboardData() {
  const [timeRange, setTimeRange] = useState("Este Mes");

  const kpi = useMemo(() => dashboardMockData.kpi as KPIMetrics, [timeRange]);

  const chartData = useMemo(() => dashboardMockData.salesTrend, []);
  const distributionData = useMemo(
    () => dashboardMockData.distributionData,
    [],
  );
  const channelData = useMemo(() => dashboardMockData.channelData, []);

  const renewals = useMemo(() => {
    return dashboardMockData.renewals.map((item) => ({
      ...item,
      clientName: item.client,
      type: item.policy,
      renewalDate: item.date,
      premium: item.amount,
    }));
  }, [timeRange]);

  const exportToExcel = () => {
    const headers = [
      "ID",
      "Cliente",
      "Póliza",
      "Fecha Vencimiento",
      "Monto",
      "Riesgo",
    ];
    const rows = renewals.map((r) => [
      r.id,
      `"${r.client}"`,
      `"${r.policy}"`,
      r.date,
      r.amount,
      r.risk,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_${timeRange.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    timeRange,
    setTimeRange,
    kpi,
    chartData,
    distributionData,
    channelData,
    renewals,
    exportToExcel,
  };
}
