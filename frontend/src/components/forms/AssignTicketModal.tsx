import { useEffect, useState } from "react";
import { X, UserCheck } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import type { User } from "../../types/user";
import { assignTicket } from "../../api/ticketDetailsApi";

interface Props {
  open: boolean;
  ticketId: string;
  onClose: () => void;
  onAssigned: (agent: User) => void;
}

export default function AssignTicketModal({
  open,
  ticketId,
  onClose,
  onAssigned,
}: Props) {
  const { users, loading, fetchUsers } = useUsers({ role: "AGENT" });

  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers({ role: "AGENT" });
    }
  }, [open]);

  if (!open) return null;

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();

    const agent = users.find((user) => user.id === selectedAgent);

    if (!agent) {
      alert("Please select an agent.");
      return;
    }

    try {
      setAssigning(true);

      await assignTicket(ticketId, {
        agent_id: agent.id,
      });

      alert("Ticket assigned successfully.");

      onAssigned(agent);
      onClose();
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Failed to assign ticket."
      );
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Assign Ticket
            </h2>

            <p className="text-sm text-slate-500">
              Select an available support agent.
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Support Agent
          </label>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3"
            required
          >
            <option value="">Choose an agent...</option>

            {users.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <UserCheck size={18} />
              <span className="font-semibold">Available Agents</span>
            </div>

            {loading ? (
              <p className="text-sm text-blue-600">
                Loading agents...
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-700">
                        {agent.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {agent.email}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              disabled={assigning}
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {assigning ? "Assigning..." : "Assign Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

