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
      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-5 text-left">Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer border-b hover:bg-blue-50 transition"
              >
                <td className="p-5">
                  <p className="font-semibold">{ticket.title}</p>

                  <p className="max-w-sm truncate text-sm text-slate-500">
                    {ticket.description}
                  </p>
                </td>

                <td>
                  <StatusBadge status={ticket.status} />
                </td>

                <td>
                  <PriorityBadge priority={ticket.priority} />
                </td>

                <td className="text-sm text-slate-500">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </td>

                <td>
                  <button className="rounded-xl bg-blue-100 p-2 text-blue-600">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/30">
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Ticket Details
              </h2>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-500">Title</p>

                <h3 className="text-xl font-semibold">
                  {selectedTicket.title}
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Description</p>

                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-sm text-slate-500">Status</p>

                  <StatusBadge status={selectedTicket.status} />
                </div>

                <div>
                  <p className="mb-1 text-sm text-slate-500">Priority</p>

                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Customer ID</p>

                <p className="break-all text-sm text-slate-700">
                  {selectedTicket.customer_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Assigned Agent</p>

                <p className="break-all text-sm text-slate-700">
                  {selectedTicket.assigned_to ?? "Not Assigned"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Created</p>

                <p className="text-slate-700">
                  {new Date(selectedTicket.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Last Updated</p>

                <p className="text-slate-700">
                  {new Date(selectedTicket.updated_at).toLocaleString()}
                </p>
              </div>

              <Link
                to={`/tickets/${selectedTicket.id}`}
                className="block rounded-xl bg-blue-600 py-3 text-center font-medium text-white hover:bg-blue-700"
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
