import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  Filter,
  Search,
  Ticket,
  RefreshCw,
  Eye,
  UserPlus,
} from "lucide-react";

import { getTickets, type Ticket as TicketType } from "../../api/ticketApi";
import useWebSocket from "../../hooks/useWebSocket";
import AssignTicketModal from "../../components/tickets/AssignTicketModal";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AgentQueuePage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketType | null>(null);

  async function loadTickets() {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useWebSocket((message) => {
    if (
      message.event === "ticket_assigned" ||
      message.event === "ticket_status_changed"
    ) {
      loadTickets();
    }
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" ||
        ticket.priority.toUpperCase() === priorityFilter;

      const normalizedStatus = ticket.status
        .replace(" ", "_")
        .toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" || normalizedStatus === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tickets, searchQuery, priorityFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "Open").length,
      pending: tickets.filter((t) => t.status === "Pending").length,
      assigned: tickets.filter((t) => t.assigned_to).length,
      high: tickets.filter((t) => t.priority === "High").length,
    };
  }, [tickets]);

  function openAssignModal(ticket: TicketType) {
    setSelectedTicket(ticket);
    setModalOpen(true);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-2 md:p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Agent Ticket Queue
            </h1>

            <p className="text-slate-500 dark:text-slate-400">
              View and manage tickets assigned to support agents.
            </p>
          </div>

          <button
            onClick={loadTickets}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw size={18} />
            Refresh Queue
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <QueueCard title="Open Tickets" value={stats.open} color="bg-blue-600" />
          <QueueCard title="Pending Tickets" value={stats.pending} color="bg-orange-500" />
          <QueueCard title="Assigned" value={stats.assigned} color="bg-emerald-600" />
          <QueueCard title="High Priority" value={stats.high} color="bg-red-600" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow dark:bg-slate-900 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full rounded-xl border py-2 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border px-4 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border px-4 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="ALL">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-blue-50 p-8 text-center text-blue-600">
            Loading ticket queue...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow dark:bg-slate-900">
            <Ticket size={40} className="mx-auto mb-3 text-slate-400" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">
              No Tickets Found
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {ticket.title}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase dark:bg-slate-800 dark:text-white">
                        {ticket.status}
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock3 size={16} />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        onClick={() => openAssignModal(ticket)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <UserPlus size={16} />
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AssignTicketModal
          open={modalOpen}
          ticketId={selectedTicket?.id ?? ""}
          onClose={() => setModalOpen(false)}
          onAssigned={async () => {
            await loadTickets();
            setModalOpen(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}

function QueueCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`${color} rounded-2xl p-5 text-white shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}


