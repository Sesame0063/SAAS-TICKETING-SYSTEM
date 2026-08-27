import DashboardLayout from "../../layouts/DashboardLayout";
import useNotifications from "../../hooks/useNotifications";
import useWebSocket from "../../hooks/useWebSocket";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    markRead,
    remove,
    refresh,
  } = useNotifications();

  useWebSocket((message) => {
    if (message.event === "notification_created") {
      refresh();
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div className="flex items-center gap-3">
          <Bell className="text-blue-600" size={30} />
          <h1 className="text-3xl font-bold text-slate-800">
            Notifications
          </h1>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-slate-500">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <Bell size={40} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold">
              You're all caught up!
            </h2>
            <p className="mt-2 text-slate-500">
              No notifications available.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  notification.is_read
                    ? "border-slate-200 bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex flex-1 gap-4">

                    <div
                      className={`mt-2 h-3 w-3 rounded-full ${
                        notification.is_read
                          ? "bg-slate-300"
                          : "bg-blue-600"
                      }`}
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {notification.title}
                      </h3>

                      <p className="mt-1 text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-2">

                    {!notification.is_read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200"
                        title="Mark as read"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => remove(notification.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                      title="Delete notification"
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

