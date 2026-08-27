import api from "./axios";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;

  customer_id: string;
  assigned_to: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: string;
}

export async function getMyTickets(): Promise<Ticket[]> {
  const { data } = await api.get("/tickets");
  return data;
}

export async function getAllTickets(): Promise<Ticket[]> {
  const { data } = await api.get("/admin/tickets");
  return data;
}

export async function createTicket(
  payload: CreateTicketRequest
): Promise<Ticket> {
  const { data } = await api.post("/tickets", payload);
  return data;
}

export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`/tickets/${id}`);
}

export async function getTickets(): Promise<Ticket[]> {
  const { data } = await api.get("/tickets");
  return data;
}
