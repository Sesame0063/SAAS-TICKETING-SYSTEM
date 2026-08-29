import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, User, Clock } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import TicketHeader from "../../components/tickets/TicketHeader";
import TicketTimeline from "../../components/tickets/TicketTimeline";
import CommentBox from "../../components/tickets/CommentBox";
import AttachmentList from "../../components/tickets/AttachmentList";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

import { getTicketById } from "../../api/ticketDetailsApi";
import useWebSocket from "../../hooks/useWebSocket";
import type { Ticket } from "../../api/ticketApi";

export default function TicketDetailsPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTicket() {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [id]);

  useWebSocket((message) => {
    if (
      message.ticket_id === id &&
      (message.event === "ticket_assigned" ||
        message.event === "ticket_status_changed")
    ) {
      loadTicket();
    }
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl bg-white p-10 text-center shadow-md">
          Loading ticket details...
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl bg-red-50 p-10 text-center text-red-600 shadow-md">
          Ticket not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <TicketHeader ticket={ticket} onStatusUpdated={loadTicket} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="mb-5 text-2xl font-bold text-slate-800">
                Ticket Description
              </h2>

              <p className="leading-8 whitespace-pre-wrap text-slate-600">
                {ticket.description}
              </p>
            </div>

            <CommentBox ticketId={ticket.id} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h3 className="mb-5 text-xl font-semibold text-slate-800">
                Ticket Information
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm text-slate-500">Status</p>
                  <StatusBadge status={ticket.status} />
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-500">Priority</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <div className="flex items-start gap-3">
                  <User className="mt-1 text-blue-600" size={18} />

                  <div>
                    <p className="text-sm text-slate-500">Customer ID</p>

                    <p className="break-all text-sm text-slate-700">
                      {ticket.customer_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="mt-1 text-emerald-600" size={18} />

                  <div>
                    <p className="text-sm text-slate-500">Assigned Agent</p>

                    <p className="break-all text-sm text-slate-700">
                      {ticket.assigned_to ?? "Not Assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 text-indigo-600" size={18} />

                  <div>
                    <p className="text-sm text-slate-500">Created</p>

                    <p className="text-sm text-slate-700">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 text-orange-600" size={18} />

                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>

                    <p className="text-sm text-slate-700">
                      {new Date(ticket.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <TicketTimeline ticketId={ticket.id} />
            <AttachmentList ticketId={ticket.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
