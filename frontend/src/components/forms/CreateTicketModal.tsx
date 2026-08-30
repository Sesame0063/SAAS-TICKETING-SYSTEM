import { useState } from "react";
import { X } from "lucide-react";

import { createTicket } from "../../api/ticketApi";
import { successToast, errorToast } from "../../utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export default function CreateTicketModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createTicket({
        title,
        description,
        priority,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");

      await onCreated();
      successToast("Ticket created successfully!");
      onClose();
    } catch (err: any) {
      console.error("Create Ticket Error:", err.response?.data);

      errorToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl border border-cyan-500/20 bg-[#020817] p-8 text-white shadow-2xl shadow-cyan-900/30">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">🎫 Create New Ticket</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-500"
          />

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            required
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-500"
          />

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: "critical",
                label: "🔴 Critical",
                active: "bg-red-600 text-white border-red-500",
              },
              {
                value: "high",
                label: "🟠 High",
                active: "bg-orange-600 text-white border-orange-500",
              },
              {
                value: "medium",
                label: "🟡 Medium",
                active: "bg-yellow-500 text-black border-yellow-400",
              },
              {
                value: "low",
                label: "🟢 Low",
                active: "bg-green-600 text-white border-green-500",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPriority(item.value)}
                className={`rounded-xl border p-3 font-semibold transition-all ${
                  priority === item.value
                    ? item.active
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
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
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "🎫 Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}










