import {
  CirclePlus,
  MessageSquare,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

const activities = [
  {
    title: "New ticket created",
    description: "Payment gateway issue reported by customer.",
    time: "2 minutes ago",
    icon: CirclePlus,
    color: "text-cyan-400",
  },
  {
    title: "Agent assigned",
    description: "Ticket assigned to Support Agent.",
    time: "15 minutes ago",
    icon: UserCheck,
    color: "text-violet-400",
  },
  {
    title: "New customer comment",
    description: "Customer uploaded additional screenshots.",
    time: "38 minutes ago",
    icon: MessageSquare,
    color: "text-amber-400",
  },
  {
    title: "Ticket resolved",
    description: "Login issue marked as resolved.",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

export default function ActivityTimeline() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Recent Activity
        </h2>

        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Live
        </span>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.title}
            className="flex gap-4 rounded-2xl bg-slate-800/50 p-4"
          >
            <div className={`mt-1 ${activity.color}`}>
              <activity.icon size={22} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-white">
                {activity.title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {activity.description}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




