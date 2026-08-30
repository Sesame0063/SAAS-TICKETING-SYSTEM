import { useState } from "react";
import { CalendarDays, RefreshCcw, UserRound } from "lucide-react";

import type { Ticket } from "../../api/ticketApi";
import { updateTicketStatus } from "../../api/ticketDetailsApi";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import { errorToast, successToast } from "../../utils/toast";

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
      successToast("Ticket status updated successfully!");
      onStatusUpdated();
    } catch (err: any) {
      console.error("Status Update Error:", err.response?.data);

      errorToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update ticket status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#020817] p-6 text-white shadow-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">Ticket ID</p>

          <p className="font-mono text-cyan-400 break-all">{ticket.id}</p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            {ticket.title}
          </h1>

          <p className="mt-2 text-slate-400">Customer Support Ticket</p>
        </div>

        <div className="flex flex-col gap-3">
          <StatusBadge status={status} />

          <PriorityBadge priority={ticket.priority} />

          {(role === "ADMIN" || role === "AGENT") && (
            <div className="mt-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Update Status
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
                >
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw size={16} />

                  {saving ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 text-sm md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <CalendarDays size={18} className="text-cyan-400" />

          <div>
            <p className="font-medium text-slate-300">Created</p>
            <p className="text-slate-400">
              {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <UserRound size={18} className="text-green-400" />

          <div>
            <p className="font-medium text-slate-300">Last Updated</p>
            <p className="text-slate-400">
              {new Date(ticket.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}








