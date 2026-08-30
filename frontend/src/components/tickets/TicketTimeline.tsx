import { getTicketHistory, type TicketHistoryItem } from "../../api/ticketDetailsApi";
import { useEffect, useState } from "react";
import ActivityTimeline from "./ActivityTimeline";

interface Props {
  ticketId: string;
}

export default function TicketTimeline({ ticketId }: Props) {
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const data = await getTicketHistory(ticketId);
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load ticket history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [ticketId]);

  return (
    <div className="glass-card p-6 rounded-3xl">
      <h2 className="mb-6 text-xl font-semibold text-slate-800 dark:text-white">
        Activity Timeline
      </h2>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">
          Loading timeline...
        </p>
      ) : history.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No activity available.
        </p>
      ) : (
        <ActivityTimeline events={history} />
      )}
    </div>
  );
}







