import api from "./axios";

export interface DashboardStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

interface DashboardApiResponse {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardApiResponse>("/reports/dashboard");

  return {
    total: data.total_tickets,
    open: data.open_tickets,
    in_progress: data.in_progress_tickets,
    resolved: data.resolved_tickets,
    closed: data.closed_tickets,
  };
}

