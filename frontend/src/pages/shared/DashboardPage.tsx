import {
  Ticket,
  Clock3,
  CheckCircle2,
  Archive,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/dashboard/DashboardCards";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import QuickActions from "../../components/dashboard/QuickActions";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";

import PriorityChart from "../../components/analytics/PriorityChart";
import TicketStatusChart from "../../components/analytics/TicketStatusChart";
import TicketTrendChart from "../../components/analytics/TicketTrendChart";

import useReports from "../../hooks/useReports";
import { useProfile } from "../../hooks/useProfile";

export default function DashboardPage() {
  const { report, loading, error } = useReports();
  const { profile } = useProfile();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-[32px] bg-slate-100 dark:bg-slate-800" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-red-300">
          Failed to load dashboard analytics.
        </div>
      </DashboardLayout>
    );
  }

  const statusChartData = [
    { name: "Open", value: report.open_tickets ?? 0 },
    { name: "Pending", value: report.pending_tickets ?? 0 },
    { name: "Resolved", value: report.resolved_tickets ?? 0 },
    { name: "Closed", value: report.closed_tickets ?? 0 },
  ];

  const priorityChartData = [
    { priority: "High", count: 3 },
    { priority: "Medium", count: 5 },
    { priority: "Low", count: report.total_tickets ?? 0 },
  ];

  const trendChartData = [
    { date: "Mon", tickets: 3 },
    { date: "Tue", tickets: 5 },
    { date: "Wed", tickets: 2 },
    { date: "Thu", tickets: 7 },
    { date: "Fri", tickets: report.total_tickets ?? 1 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <WelcomeBanner
          userName={
            profile?.first_name ??
            profile?.email?.split("@")[0] ??
            "Agent"
          }
          role={profile?.role ?? "Support Agent"}
          totalTickets={report.total_tickets ?? 0}
          notifications={16}
        />

        <DashboardCards report={report} />

        <QuickActions />

        <div className="grid gap-8 xl:grid-cols-2">

          <div className="rounded-3xl border border-cyan-500/20 bg-white dark:bg-slate-900/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Ticket Status Distribution
              </h2>
            </div>

            <TicketStatusChart data={statusChartData} />
          </div>

          <div className="rounded-3xl border border-violet-500/20 bg-white dark:bg-slate-900/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <Ticket className="text-violet-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tickets by Priority
              </h2>
            </div>

            <PriorityChart data={priorityChartData} />
          </div>

        </div>

        <div className="rounded-3xl border border-blue-500/20 bg-white dark:bg-slate-900/60 p-6 backdrop-blur">

          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Ticket Creation Trend
            </h2>
          </div>

          <TicketTrendChart data={trendChartData} />

        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">

          <div className="rounded-3xl border border-cyan-500/20 bg-white dark:bg-slate-900/60 p-6 backdrop-blur">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Live Workspace Overview
              </h2>

              <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Production
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-5">
                <Clock3 className="mb-3 text-amber-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pending Tickets
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {report.pending_tickets ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-5">
                <CheckCircle2 className="mb-3 text-emerald-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Resolved Today
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {report.resolved_tickets ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-5">
                <Archive className="mb-3 text-violet-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Closed Tickets
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {report.closed_tickets ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-5">
                <Ticket className="mb-3 text-cyan-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Tickets
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {report.total_tickets ?? 0}
                </h3>
              </div>

            </div>

          </div>

          <ActivityTimeline />

        </div>

      </div>
    </DashboardLayout>
  );
}












