import api from "./axios";
import type { Ticket } from "./ticketApi";

export interface TicketHistoryItem {
  id: string;
  action: string;
  description: string;
  created_at: string;
  performed_by: string;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface AssignTicketRequest {
  agent_id: string;
}

export async function getTicketById(id: string): Promise<Ticket> {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

export async function getTicketHistory(
  id: string
): Promise<TicketHistoryItem[]> {
  const { data } = await api.get(`/tickets/${id}/history`);
  return data;
}

export async function updateTicketStatus(
  id: string,
  payload: UpdateStatusRequest
): Promise<Ticket> {
  const { data } = await api.patch(`/tickets/${id}/status`, payload);
  return data;
}

export async function assignTicket(
  id: string,
  payload: AssignTicketRequest
): Promise<Ticket> {
  const { data } = await api.patch(`/tickets/${id}/assign`, payload);
  return data;
}

