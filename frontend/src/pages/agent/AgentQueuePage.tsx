import { useMemo, useState } from "react";
import { Clock3, Filter, Search, Ticket } from "lucide-react";
import { getTickets, type Ticket as TicketType } from "../../api/ticketApi";

import { useEffect } from "react";
import AssignTicketModal from "../../components/tickets/AssignTicketModal";

export default function AgentQueuePage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();
        setTickets(data);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" ||
        ticket.priority.toUpperCase() === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tickets, searchQuery, priorityFilter]);

  function openAssignModal(ticket: TicketType) {
    setSelectedTicket(ticket);
    setModalOpen(true);
  }

  return (
    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Agent Ticket Queue
          </h1>

          <p className="text-slate-500">
            View and manage tickets assigned to support agents.
          </p>
        </div>

        <div className="rounded-xl bg-blue-600 px-5 py-3 text-white shadow-lg">
          <p className="text-xs uppercase tracking-wide">
            Total Queue
          </p>

          <h2 className="text-2xl font-bold">
            {filteredTickets.length}
          </h2>
        </div>

      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow md:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

      </div>

      {loading ? (
        <div className="rounded-xl bg-blue-50 p-6 text-center text-blue-600">
          Loading ticket queue...
        </div>
      ) : (
        <div className="space-y-4">

          {filteredTickets.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <Ticket
                size={36}
                className="mx-auto mb-4 text-slate-400"
              />

              <h3 className="text-lg font-semibold text-slate-700">
                No Tickets Found
              </h3>

              <p className="text-slate-500">
                No tickets match the selected filters.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-800">
                      {ticket.title}
                    </h2>

                    <p className="text-sm text-slate-600">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap gap-3">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                        {ticket.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          ticket.priority.toUpperCase() === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : ticket.priority.toUpperCase() === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ticket.priority}
                      </span>

                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={16} />

                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>

                    <button onClick={() => openAssignModal(ticket)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                      Assign Ticket
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      )}


      <AssignTicketModal
        open={modalOpen}
        ticketId={selectedTicket?.id ?? ""}
        onClose={() => setModalOpen(false)}
        onAssigned={async () => {
          const updated = await getTickets();
          setTickets(updated);
          setModalOpen(false);
        }}
      />
    </div>
  );
}







