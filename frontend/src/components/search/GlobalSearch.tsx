import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Ticket, Users, BookOpen } from "lucide-react";

import { getTickets, type Ticket as TicketType } from "../../api/ticketApi";
import { getUsers } from "../../api/userApi";
import type { User } from "../../types/user";
import {
  getArticles,
  type KnowledgeArticle,
} from "../../api/knowledgeBaseApi";

export default function GlobalSearch() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketData, userData, articleData] = await Promise.all([
          getTickets(),
          getUsers(),
          getArticles(),
        ]);

        setTickets(ticketData);
        setUsers(userData.users);
        setArticles(articleData);
      } catch (err) {
        console.error("Global search failed to load data:", err);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return [
      ...tickets
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          title: t.title,
          subtitle: "Ticket",
          icon: Ticket,
          path: `/tickets/${t.id}`,
        })),

      ...users
        .filter(
          (u) =>
            u.first_name.toLowerCase().includes(q) ||
            u.last_name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((u) => ({
          id: u.id,
          title: `${u.first_name} ${u.last_name}`,
          subtitle: "User",
          icon: Users,
          path: "/users",
        })),

      ...articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: "Knowledge Base",
          icon: BookOpen,
          path: "/knowledge-base",
        })),
    ];
  }, [query, tickets, users, articles]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#020817] shadow-2xl">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-700 p-5">
          <Search className="text-cyan-400" size={22} />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, users, articles..."
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto p-3">
          {results.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              Start typing to search...
            </p>
          ) : (
            results.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-slate-800"
                >
                  <div className="rounded-xl bg-cyan-500/10 p-3">
                    <Icon className="text-cyan-400" size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {item.title}
                    </p>

                    <p className="text-sm text-slate-400">{item.subtitle}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-3 text-center text-xs text-slate-500">
          Press <span className="font-semibold text-cyan-400">Ctrl + K</span> to
          search • <span className="font-semibold text-cyan-400">Esc</span> to
          close
        </div>
      </div>
    </div>
  );
}

