import api from "./axios";

export interface DashboardReport {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;

  status_distribution: {
    name: string;
    value: number;
  }[];

  priority_distribution: {
    priority: string;
    count: number;
  }[];

  ticket_trend: {
    date: string;
    tickets: number;
  }[];
}

export async function getDashboardReport(): Promise<DashboardReport> {
  const { data } = await api.get("/reports/dashboard");
  return data;
}


