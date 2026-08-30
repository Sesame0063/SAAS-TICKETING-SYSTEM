import { Bell, CheckCircle2, Clock3, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
};

const notifications = [
  {
    id: 1,
    title: "New Ticket Assigned",
    message: "Payment gateway issue assigned to you.",
    time: "2 min ago",
    icon: Bell,
    color: "text-cyan-400",
  },
  {
    id: 2,
    title: "Customer Replied",
    message: "Customer uploaded additional screenshots.",
    time: "15 min ago",
    icon: MessageSquare,
    color: "text-yellow-400",
  },
  {
    id: 3,
    title: "SLA Warning",
    message: "Ticket #TK-108 nearing SLA deadline.",
    time: "40 min ago",
    icon: Clock3,
    color: "text-orange-400",
  },
  {
    id: 4,
    title: "Ticket Closed",
    message: "Account Lockout issue resolved.",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "text-green-400",
  },
];

export default function NotificationDropdown({ open }: Props) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <h3 className="font-semibold text-white">Notifications</h3>

        <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">
          {notifications.length}
        </span>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {notifications.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="border-b border-slate-800 p-4 transition hover:bg-slate-900/60"
            >
              <div className="flex gap-3">
                <div className={`${item.color} mt-1`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-white">{item.title}</p>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3">
        <button onClick={() => navigate("/notifications")} className="w-full rounded-xl bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-500">
          View All Notifications
        </button>
      </div>
    </div>
  );
}










