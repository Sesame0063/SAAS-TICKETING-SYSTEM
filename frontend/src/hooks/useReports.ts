import { useEffect, useState } from "react";
import type {
  DashboardSummary,
  DashboardReport,
  PriorityReport,
  AgentReport,
  CustomerReport,
} from "../types/report";

import {
  getDashboardSummary,
  getDashboardReport,
  getAgentReport,
  getCustomerReport,
  exportCsvReport,
  exportPdfReport,
} from "../api/reportApi";

export function useReports() {
  const [summary, setSummary] = useState<DashboardSummary>({
  total_tickets:0,
  open_tickets:0,
  in_progress_tickets:0,
  pending_tickets:0,
  resolved_tickets:0,
  closed_tickets:0,
  total_customers:0,
  total_agents:0,
});
  const [statusDistribution, setStatusDistribution] = useState<DashboardReport[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<PriorityReport[]>([]);
  const [agentReport, setAgentReport] = useState<AgentReport[]>([]);
  const [customerReport, setCustomerReport] = useState<CustomerReport[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchReports() {
    try {
      setLoading(true);
      setError("");

      const [
        summaryData,
        dashboardData,
        agentData,
        customerData,
      ] = await Promise.all([
        getDashboardSummary(),
        getDashboardReport(),
        getAgentReport(),
        getCustomerReport(),
      ]);

      setSummary(summaryData);
      setStatusDistribution(dashboardData.status_distribution ?? dashboardData.status ?? []);
      setPriorityDistribution(dashboardData.priority_distribution ?? dashboardData.priority ?? []);
      setAgentReport(agentData);
      setCustomerReport(customerData);

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadCsv() {
    try {
      const blob = await exportCsvReport();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "ticket-report.csv";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download CSV report.");
    }
  }

  async function downloadPdf() {
    try {
      const blob = await exportPdfReport();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "ticket-report.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download PDF report.");
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    summary,
    statusDistribution,
    priorityDistribution,
    agentReport,
    customerReport,
    loading,
    error,
    fetchReports,
    downloadCsv,
    downloadPdf,
  };
}


