import { useEffect, useState } from "react";
import { Clock3, CheckCircle2 } from "lucide-react";
import {
  getTicketHistory,
  type TicketHistoryItem,
} from "../../api/ticketDetailsApi";

interface Props {
  ticketId: string;
}

export default function TicketTimeline({ ticketId }: Props) {
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await getTicketHistory(ticketId);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load timeline:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [ticketId]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Activity Timeline
      </h2>

      {loading ? (
        <p className="text-slate-500">Loading timeline...</p>
      ) : history.length === 0 ? (
        <p className="text-slate-500">No activity available.</p>
      ) : (
        <div className="space-y-6">
          {history.map((item) => {
            const action = item.action ?? "Activity";
            const description =
              item.description ?? "Ticket activity recorded.";

            return (
              <div key={item.id} className="flex gap-4">
                <div className="rounded-full bg-blue-100 p-2">
                  {action.toLowerCase().includes("resolved") ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <Clock3 size={16} className="text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{action}</p>

                  <p className="text-sm text-slate-500">
                    {description}
                  </p>

                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>{item.performed_by ?? "System"}</span>

                    <span>
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
