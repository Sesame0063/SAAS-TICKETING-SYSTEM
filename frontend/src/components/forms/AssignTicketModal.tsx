import { useEffect, useState } from "react";
import { X, UserCheck } from "lucide-react";

import { assignTicket } from "../../api/ticketDetailsApi";
import { errorToast, successToast } from "../../utils/toast";
import { useUsers } from "../../hooks/useUsers";
import type { User } from "../../types/user";

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
  }, [open, fetchUsers]);

  if (!open) return null;

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();

    const agent = users.find((user) => user.id === selectedAgent);

    if (!agent) {
      errorToast("Please select an agent.");
      return;
    }

    try {
      setAssigning(true);

      await assignTicket(ticketId, {
        agent_id: agent.id,
      });

      successToast("Ticket assigned successfully!");

      onAssigned(agent);
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
      setAssigning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#020817] p-8 text-white shadow-2xl shadow-cyan-900/30">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Assign Ticket</h2>
            <p className="text-sm text-slate-400">
              Select an available support agent.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-300">
            Support Agent
          </label>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="">Choose an agent...</option>

            {users.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-300">
              <UserCheck size={18} />
              <span className="font-semibold">Available Agents</span>
            </div>

            {loading ? (
              <p className="text-sm text-cyan-400">Loading agents...</p>
            ) : (
              <div className="space-y-2">
                {users.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.email}</p>
                    </div>

                    <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400">
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
              className="rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={assigning}
              className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {assigning ? "Assigning..." : "Assign Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}










