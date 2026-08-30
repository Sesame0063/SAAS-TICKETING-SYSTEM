import { Link } from "react-router-dom";
import {
  PlusCircle,
  Users,
  BookOpen,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Create Ticket",
    description: "Open a new support ticket",
    icon: PlusCircle,
    to: "/tickets",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Manage Users",
    description: "View agents and customers",
    icon: Users,
    to: "/users",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    title: "Knowledge Base",
    description: "Browse support articles",
    icon: BookOpen,
    to: "/knowledge-base",
    gradient: "from-emerald-500 to-green-700",
  },
  {
    title: "Reports",
    description: "Analytics and exports",
    icon: BarChart3,
    to: "/reports",
    gradient: "from-orange-500 to-pink-600",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <p className="text-sm text-slate-400">
            Frequently used workspace shortcuts.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="group rounded-3xl bg-slate-900/70 border border-slate-700 p-6 transition-all hover:-translate-y-1 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,.2)]"
          >
            <div
              className={`inline-flex rounded-2xl bg-gradient-to-br ${action.gradient} p-3`}
            >
              <action.icon className="text-white" size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              {action.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {action.description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-cyan-400 group-hover:gap-3 transition-all">
              <span className="text-sm font-medium">Open</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}




