import { useState } from "react";
import { CalendarDays, RefreshCcw, UserRound } from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";

import { updateTicketStatus } from "../../api/ticketDetailsApi";
import type { Ticket } from "../../api/ticketApi";

interface Props {
  ticket: Ticket;
  onStatusUpdated: () => void;
}

const statusOptions = [
  "Open",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];

export default function TicketHeader({
  ticket,
  onStatusUpdated,
}: Props) {
  const role = localStorage.getItem("user_role") ?? "CUSTOMER";

  const [status, setStatus] = useState(ticket.status);
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(nextStatus: string) {
    try {
      setSaving(true);

      await updateTicketStatus(ticket.id, {
        status: nextStatus,
      });

      setStatus(nextStatus);
      onStatusUpdated();
    } catch {
      alert("Failed to update ticket status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm text-slate-500">Ticket ID</p>

          <p className="font-mono text-blue-600">
            {ticket.id}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {ticket.title}
          </h1>

          <p className="mt-2 text-slate-500">
            Customer Support Ticket
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <StatusBadge status={status} />

          <PriorityBadge priority={ticket.priority} />

          {(role === "ADMIN" || role === "AGENT") && (
            <div className="mt-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Update Status
              </label>

              <div className="flex gap-2">

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                >
                  {statusOptions.map((item) => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  disabled={saving}
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <RefreshCcw size={16} />

                  {saving ? "Saving..." : "Update"}
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-600 md:grid-cols-2">

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <CalendarDays size={18} className="text-blue-600" />

          <div>
            <p className="font-medium">Created</p>

            <p>{new Date(ticket.created_at).toLocaleString()}</p>
          </div>

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <UserRound size={18} className="text-green-600" />

          <div>
            <p className="font-medium">Last Updated</p>

            <p>{new Date(ticket.updated_at).toLocaleString()}</p>
          </div>

        </div>

      </div>

    </div>
  );
}
