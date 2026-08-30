import { useState } from "react";
import { errorToast } from "../../utils/toast";
import { Send, Trash2 } from "lucide-react";

import useComments from "../../hooks/useComments";

interface Props {
  ticketId: string;
}

export default function CommentBox({ ticketId }: Props) {
  const {
    comments,
    loading,
    sendComment,
    removeComment,
  } = useComments(ticketId);

  const [text, setText] = useState("");

  const role =
    (localStorage.getItem("user_role") ?? "").toUpperCase();

  async function handleSend() {
    if (!text.trim()) return;

    try {
      await sendComment(text.trim());
      setText("");
    } catch {
      errorToast("Failed to send comment.");
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;

    try {
      await removeComment(commentId);
    } catch {
      errorToast("Failed to delete comment.");
    }
  }

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-700 dark:bg-slate-900 p-6 shadow-md">

      <h2 className="mb-6 text-xl font-semibold">
        Comments
      </h2>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400">
          Loading comments...
        </p>
      ) : comments.length === 0 ? (
        <p className="mb-6 text-slate-500 dark:text-slate-400 dark:text-slate-400">
          No comments yet.
        </p>
      ) : (
        <div className="mb-6 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-700">
                    {comment.user_id.slice(0, 8)}
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>

                {(role === "ADMIN" || role === "AGENT") && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-300 dark:text-slate-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full resize-none rounded-xl border p-4 outline-none focus:border-blue-500"
      />

      <button
        onClick={handleSend}
        className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        <Send size={18} />
        Send Comment
      </button>

    </div>
  );
}












