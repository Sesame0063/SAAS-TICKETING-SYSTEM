import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, Clock3, UserCircle } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { getTickets, type Ticket } from "../../api/ticketApi";
import { createComment } from "../../api/commentApi";

import useComments from "../../hooks/useComments";

import TicketHeader from "../../components/tickets/TicketHeader";
import CommentBox from "../../components/tickets/CommentBox";
import AttachmentList from "../../components/tickets/AttachmentList";
import TicketTimeline from "../../components/tickets/TicketTimeline";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const ticketId = id ?? "";

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [quickReply, setQuickReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { comments = [], reloadComments } = useComments(ticketId);

  useEffect(() => {
    if (!ticketId) return;

    async function loadTicket() {
      try {
        const tickets = await getTickets();
        const currentTicket = tickets.find((t) => t.id === ticketId) ?? null;
        setTicket(currentTicket);
      } catch (err) {
        console.error("Failed to load ticket", err);
      }
    }

    loadTicket();
  }, [ticketId]);

  async function handleQuickReply() {
    if (!quickReply.trim()) return;

    try {
      setSendingReply(true);

      await createComment(ticketId, {
        content: quickReply,
      });

      setQuickReply("");
      await reloadComments();

      const tickets = await getTickets();
      const updatedTicket = tickets.find((t) => t.id === ticketId) ?? null;
      setTicket(updatedTicket);
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setSendingReply(false);
    }
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="glass-card p-10 text-center text-slate-400">
          Loading ticket...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <TicketHeader ticket={ticket} onStatusUpdated={reloadComments} />

        <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <UserCircle className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Conversation</h2>
              </div>

              <div className="space-y-5">
                {comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl bg-slate-900/70 p-4"
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold text-white">
                        {comment.author_name}
                      </p>

                      <span className="text-xs text-slate-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-3 text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-800 pt-6">
                <CommentBox ticketId={ticketId} />
              </div>
            </div>

            <AttachmentList ticketId={ticketId} />
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="mb-5 text-xl font-bold text-white">
                Ticket Activity
              </h2>

              <TicketTimeline ticketId={ticketId} />
            </div>

            <div className="glass-card space-y-4 p-6">
              <h2 className="text-xl font-bold text-white">Quick Reply</h2>

              <textarea
                rows={5}
                value={quickReply}
                onChange={(e) => setQuickReply(e.target.value)}
                placeholder="Write a response..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white outline-none transition-all duration-200 hover:scale-[1.01] hover:border-cyan-500 focus:border-cyan-500"
              />

              <button
                onClick={handleQuickReply}
                disabled={sendingReply || quickReply.trim() === ""}
                className="flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <Clock3 className="text-amber-400" />

                <div>
                  <p className="text-sm text-slate-400">SLA Remaining</p>

                  <h3 className="text-2xl font-bold text-white">3h 42m</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}






























