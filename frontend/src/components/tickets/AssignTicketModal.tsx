import { useEffect, useState } from "react";
import { X, UserPlus } from "lucide-react";

import { assignTicket } from "../../api/ticketDetailsApi";
import { getAgents } from "../../api/userApi";
import type { User } from "../../types/user";
import { errorToast, successToast } from "../../utils/toast";

interface Props {
  ticketId: string;
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export default function AssignTicketModal({
  ticketId,
  open,
  onClose,
  onAssigned,
}: Props) {
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    getAgents()
      .then(setAgents)
      .catch((err) => {
        console.error(err);
        errorToast("Failed to load agents.");
      });
  }, [open]);

  async function handleAssign() {
    if (!selectedAgent) {
      errorToast("Please select an agent.");
      return;
    }

    try {
      setLoading(true);

      await assignTicket(ticketId, {
        agent_id: selectedAgent,
      });

      successToast("Ticket assigned successfully!");

      onAssigned();
      onClose();
      setSelectedAgent("");
    } catch (err: any) {
      console.error("Assign Ticket Error:", err.response?.data);

      errorToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to assign ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#020817] p-6 text-white shadow-2xl shadow-cyan-900/30">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assign Ticket</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mb-3 text-slate-400">
          Choose a support agent to assign this ticket.
        </p>

        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-500"
        >
          <option value="">Select Agent</option>

          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={loading || !selectedAgent}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus size={18} />
          {loading ? "Assigning..." : "Assign Ticket"}
        </button>
      </div>
    </div>
  );
}

