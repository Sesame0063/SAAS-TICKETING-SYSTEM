import axios from "./axios";
import type {
  DashboardSummary,
  DashboardReport,
  PriorityReport,
  AgentReport,
  CustomerReport,
} from "../types/report";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await axios.get("/dashboard/summary");
  return response.data;
}

export async function getDashboardReport(): Promise<{
  status_distribution: DashboardReport[];
  priority_distribution: PriorityReport[];
}> {
  const response = await axios.get("/reports/dashboard");

  const data = response.data.data ?? response.data;

  return {
    status_distribution: data.status_distribution ?? [],
    priority_distribution: data.priority_distribution ?? [],
  };
}

export async function getAgentReport(): Promise<AgentReport[]> {
  const response = await axios.get("/reports/agents");
  return response.data.data ?? response.data;
}

export async function getCustomerReport(): Promise<CustomerReport[]> {
  const response = await axios.get("/reports/customers");
  return response.data.data ?? response.data;
}

export async function exportCsvReport(): Promise<Blob> {
  const response = await axios.get("/reports/export/csv", {
    responseType: "blob",
  });
  return response.data;
}

export async function exportPdfReport(): Promise<Blob> {
  const response = await axios.get("/reports/export/pdf", {
    responseType: "blob",
  });
  return response.data;
}
