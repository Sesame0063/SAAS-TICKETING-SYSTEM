import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Link } from "react-router-dom";

import type { Ticket } from "../../api/ticketApi";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";

interface Props {
  tickets: Ticket[];
}

export default function TicketTable({ tickets }: Props) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <>
      {/* Ticket Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr className="text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                <th className="p-5">Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th className="w-16"></th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="cursor-pointer border-b border-slate-100 transition-all duration-200 hover:bg-cyan-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                >
                  <td className="p-5">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {ticket.title}
                    </p>

                    <p className="mt-1 max-w-sm truncate text-sm text-slate-500 dark:text-slate-400">
                      {ticket.description}
                    </p>
                  </td>

                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>

                  <td>
                    <PriorityBadge priority={ticket.priority} />
                  </td>

                  <td className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="rounded-xl bg-cyan-100 p-2 text-cyan-700 transition hover:bg-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-900/70"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-[#020817] p-6 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ticket Details</h2>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-2 transition hover:bg-slate-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-400">Title</p>
                <h3 className="mt-1 text-xl font-semibold">
                  {selectedTicket.title}
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-400">Description</p>
                <p className="mt-2 whitespace-pre-wrap text-slate-300">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-sm text-slate-400">Status</p>
                  <StatusBadge status={selectedTicket.status} />
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-400">Priority</p>
                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400">Customer ID</p>
                <p className="break-all text-sm text-slate-300">
                  {selectedTicket.customer_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Assigned Agent</p>
                <p className="text-sm text-slate-300">
                  {selectedTicket.assigned_to ?? "Not Assigned"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Created</p>
                <p className="text-slate-300">
                  {new Date(selectedTicket.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Last Updated</p>
                <p className="text-slate-300">
                  {new Date(selectedTicket.updated_at).toLocaleString()}
                </p>
              </div>

              <Link
                to={`/tickets/${selectedTicket.id}`}
                className="block rounded-xl bg-cyan-600 py-3 text-center font-semibold text-white transition hover:bg-cyan-700"
              >
                View Full Ticket
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}














