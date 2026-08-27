export interface DashboardSummary {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  total_customers: number;
  total_agents: number;
}

export interface DashboardReport {
  status: string;
  count: number;
}

export interface PriorityReport {
  priority: string;
  count: number;
}

export interface AgentReport {
  agent_id: string;
  agent_name: string;
  assigned_tickets: number;
  resolved_tickets: number;
  pending_tickets: number;
}

export interface CustomerReport {
  customer_id: string;
  customer_name: string;
  total_tickets: number;
  resolved_tickets: number;
}

export interface DashboardReportResponse {
  summary: DashboardSummary;
  status_distribution: DashboardReport[];
  priority_distribution: PriorityReport[];
}

export interface CsvExportResponse {
  url: string;
}

export interface PdfExportResponse {
  url: string;
}

