import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  RefreshCw,
  ArrowUpDown,
  Filter,
  Ticket,
  Clock3,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import TicketTable from "../../components/dashboard/TicketTable";
import CreateTicketModal from "../../components/forms/CreateTicketModal";
import AssignTicketModal from "../../components/forms/AssignTicketModal";

import {
  getTickets,
  type Ticket as TicketType,
} from "../../api/ticketApi";

const PAGE_SIZE = 10;

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);

  const [page, setPage] = useState(1);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [assignTicket, setAssignTicket] = useState<TicketType | null>(null);

  async function fetchTickets() {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((ticket) =>
        [ticket.title, ticket.description, ticket.id]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      result = result.filter((ticket) => ticket.priority === priorityFilter);
    }

    result.sort((a, b) => {
      const first = new Date(a.created_at).getTime();
      const second = new Date(b.created_at).getTime();
      return sortNewest ? second - first : first - second;
    });

    return result;
  }, [tickets, search, statusFilter, priorityFilter, sortNewest]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [filteredTickets, page]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    progress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    pending: tickets.filter((t) => t.status === "PENDING").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
  }), [tickets]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Tickets
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage, assign and track customer support tickets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchTickets}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <RefreshCw size={16} /> Refresh
            </button>

            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              <UserPlus size={16} /> Create Ticket
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {[
  { label: "Total", value: stats.total, Icon: Ticket },
  { label: "Open", value: stats.open, Icon: AlertTriangle },
  { label: "In Progress", value: stats.progress, Icon: Clock3 },
  { label: "Pending", value: stats.pending, Icon: Filter },
  { label: "Resolved", value: stats.resolved, Icon: CircleCheck },
].map(({ label, value, Icon }) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {String(label)}
                </p>
                <Icon className="text-cyan-500" size={18} />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {Number(value)}
              </h2>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative xl:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search ticket title, customer, ID..."
                className="w-full rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {[
                "ALL",
                "OPEN",
                "IN_PROGRESS",
                "PENDING",
                "RESOLVED",
                "CLOSED",
              ].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-cyan-500">{filteredTickets.length}</span> tickets.
            </p>

            <button
              onClick={() => setSortNewest((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <ArrowUpDown size={16} />
              {sortNewest ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
            <Ticket size={44} className="mx-auto text-cyan-500" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              No tickets found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try changing your search or filters, or create a new ticket.
            </p>
          </div>
        ) : (
          <TicketTable tickets={paginatedTickets} />
        )}

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CreateTicketModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={fetchTickets}
      />

      {assignTicket && (
        <AssignTicketModal
          ticketId={assignTicket.id}
          open={!!assignTicket}
          onClose={() => setAssignTicket(null)}
          onAssigned={fetchTickets}
        />
      )}
    </DashboardLayout>
  );
}






















