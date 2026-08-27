import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import TicketTable from "../../components/dashboard/TicketTable";

import { getTickets, type Ticket } from "../../api/ticketApi";

import CreateTicketModal from "../../components/forms/CreateTicketModal";
import AssignTicketModal from "../../components/forms/AssignTicketModal";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  const [selectedTicketId, setSelectedTicketId] = useState("");

  const role = localStorage.getItem("user_role") ?? "CUSTOMER";

  const loadTickets = () => {
    setLoading(true);

    getTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  function handleAssign(ticketId: string) {
    setSelectedTicketId(ticketId);
    setOpenAssignModal(true);
  }

  return (
    <DashboardLayout>

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Tickets
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customer support tickets.
          </p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + New Ticket
        </button>

      </div>

      <Card>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="relative w-full md:w-96">

            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-slate-50 px-4 py-3"
          >
            <option>All</option>
            <option>Open</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            No tickets found.
          </div>
        ) : (
          <div className="space-y-5">

            <TicketTable tickets={filteredTickets} />

            {(role === "ADMIN" || role === "AGENT") && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <h3 className="mb-4 text-lg font-semibold text-slate-700">
                  Quick Ticket Assignment
                </h3>

                <div className="space-y-3">

                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
                    >

                      <div>
                        <p className="font-medium text-slate-800">
                          {ticket.title}
                        </p>

                        <p className="text-sm text-slate-500">
                          {ticket.status} • {ticket.priority}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAssign(ticket.id)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <UserPlus size={16} />
                        Assign
                      </button>

                    </div>
                  ))}

                </div>

              </div>
            )}

          </div>
        )}

      </Card>

      <CreateTicketModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={loadTickets}
      />

      <AssignTicketModal
        open={openAssignModal}
        ticketId={selectedTicketId}
        onClose={() => setOpenAssignModal(false)}
        onAssigned={() => {
          loadTickets();
        }}
      />

    </DashboardLayout>
  );
}
