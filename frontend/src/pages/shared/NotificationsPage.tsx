import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import useNotifications from "../../hooks/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unread"
          ? !item.is_read
          : item.is_read;

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Bell className="text-cyan-500" size={30} />
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>
              </div>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Stay updated with ticket assignments, comments, SLA alerts, and account activity.
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={!unreadCount}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={notifications.length} color="cyan" />
          <StatCard title="Unread" value={unreadCount} color="orange" />
          <StatCard title="Read" value={notifications.length - unreadCount} color="emerald" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === key
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={34} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
            <Bell className="mx-auto mb-4 text-slate-500" size={42} />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              No notifications found.
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${
                  item.is_read
                    ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    : "border-cyan-400 bg-cyan-50/60 dark:border-cyan-600 dark:bg-cyan-950/20"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-cyan-500/10 p-3">
                      <Bell className="text-cyan-500" size={20} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>

                        {!item.is_read && (
                          <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-slate-600 dark:text-slate-300">
                        {item.message}
                      </p>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!item.is_read && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="rounded-xl bg-emerald-600 p-3 text-white transition hover:bg-emerald-500"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="rounded-xl bg-red-600 p-3 text-white transition hover:bg-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${colors[color]} p-5 shadow-md dark:border-slate-800 dark:bg-slate-900`}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</h2>
    </div>
  );
}






