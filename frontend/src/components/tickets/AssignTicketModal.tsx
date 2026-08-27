import { useEffect, useState } from "react";
import { X, UserPlus } from "lucide-react";

import { getAgents } from "../../api/userApi";
import { assignTicket } from "../../api/ticketDetailsApi";

interface Props {
  ticketId: string;
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AssignTicketModal({
  ticketId,
  open,
  onClose,
  onAssigned,
}: Props) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    getAgents()
      .then(setAgents)
      .catch(console.error);
  }, [open]);

  async function handleAssign() {
    if (!selectedAgent) return;

    try {
      setLoading(true);

      await assignTicket(ticketId, {
        agent_id: selectedAgent,
      });

      onAssigned();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to assign ticket.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assign Ticket</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="mb-3 text-slate-600">Choose an agent.</p>

        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Select Agent</option>

          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.first_name} {agent.last_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-slate-400"
        >
          <UserPlus size={18} />
          {loading ? "Assigning..." : "Assign Ticket"}
        </button>
      </div>
    </div>
  );
}
