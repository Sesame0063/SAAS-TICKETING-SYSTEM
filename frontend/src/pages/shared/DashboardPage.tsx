import DashboardLayout from "../../layouts/DashboardLayout";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/common/Card";
import useDashboard from "../../hooks/useDashboard";

import {
  Ticket,
  Clock3,
  CheckCircle2,
  Archive,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { stats, loading, error } = useDashboard();

  return (
    <DashboardLayout>
      <WelcomeBanner />

      {error && (
        <div className="mt-6 mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <div>
              <p className="font-semibold">Dashboard data could not be loaded.</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open Tickets"
          value={loading ? "..." : String(stats?.open ?? 0)}
          color="bg-blue-500"
          icon={<Ticket size={24} />}
        />

        <StatCard
          title="In Progress"
          value={loading ? "..." : String(stats?.in_progress ?? 0)}
          color="bg-amber-500"
          icon={<Clock3 size={24} />}
        />

        <StatCard
          title="Resolved"
          value={loading ? "..." : String(stats?.resolved ?? 0)}
          color="bg-green-500"
          icon={<CheckCircle2 size={24} />}
        />

        <StatCard
          title="Closed"
          value={loading ? "..." : String(stats?.closed ?? 0)}
          color="bg-slate-700"
          icon={<Archive size={24} />}
        />
      </div>

      <Card className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <Activity className="text-blue-600" />
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          {[
            ["bg-blue-500","Ticket assigned to an agent.","2 minutes ago"],
            ["bg-amber-500","Ticket moved to In Progress.","10 minutes ago"],
            ["bg-green-500","Customer issue resolved.","25 minutes ago"],
            ["bg-red-500","SLA warning generated.","1 hour ago"],
          ].map(([color, text, time]) => (
            <div
              key={text}
              className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5"
            >
              <div className={`mt-2 h-3 w-3 rounded-full ${color}`} />

              <div>
                <p className="font-medium text-slate-700">{text}</p>
                <p className="mt-1 text-sm text-slate-400">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
