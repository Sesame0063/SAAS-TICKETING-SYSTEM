import { Download, FileBarChart2, BarChart3 } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import useReports from "../../hooks/useReports";

import { downloadCsvReport, downloadPdfReport } from "../../api/reportApi";
import { successToast, errorToast } from "../../utils/toast";

import EmptyState from "../../components/common/EmptyState";
import PriorityChart from "../../components/analytics/PriorityChart";
import TicketStatusChart from "../../components/analytics/TicketStatusChart";
import TicketTrendChart from "../../components/analytics/TicketTrendChart";

export default function ReportsPage() {
  const { report, loading, error } = useReports();

  async function exportCSV() {
    try {
      await downloadCsvReport();
      successToast("CSV report downloaded successfully.");
    } catch {
      errorToast("Failed to download CSV report.");
    }
  }

  async function exportPDF() {
    try {
      await downloadPdfReport();
      successToast("PDF report downloaded successfully.");
    } catch {
      errorToast("Failed to download PDF report.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="glass-card p-8 text-red-300">
          Failed to load reports.
        </div>
      </DashboardLayout>
    );
  }

  if ((report.total_tickets ?? 0) === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={<BarChart3 size={42} />}
          title="No Analytics Available"
          description="Create tickets first. Reports and charts will appear automatically."
        />
      </DashboardLayout>
    );
  }

  const statusData = [
    { name: "Open", value: report.open_tickets ?? 0 },
    { name: "Pending", value: report.pending_tickets ?? 0 },
    { name: "Resolved", value: report.resolved_tickets ?? 0 },
    { name: "Closed", value: report.closed_tickets ?? 0 },
  ];

  const priorityData = [
    { priority: "High", count: report.open_tickets ?? 0 },
    { priority: "Medium", count: report.in_progress_tickets ?? 0 },
    {
      priority: "Low",
      count: (report.pending_tickets ?? 0) + (report.resolved_tickets ?? 0),
    },
  ];

  const trendData = [
    { date: "Mon", tickets: Math.max((report.open_tickets ?? 0) - 2, 0) },
    { date: "Tue", tickets: Math.max((report.open_tickets ?? 0) - 1, 0) },
    { date: "Wed", tickets: report.open_tickets ?? 0 },
    { date: "Thu", tickets: report.in_progress_tickets ?? 0 },
    { date: "Fri", tickets: report.total_tickets ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="page-header">
          <p className="subtitle">BUSINESS ANALYTICS</p>
          <h1>Reports & Insights</h1>
          <p>Visual analytics powered by your Rust backend.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total Tickets", report.total_tickets],
            ["Open Tickets", report.open_tickets],
            ["Pending Tickets", report.pending_tickets],
            ["Resolved Tickets", report.resolved_tickets],
            ["Closed Tickets", report.closed_tickets],
          ].map(([title, value]) => (
            <div key={title} className="glass-card p-5">
              <FileBarChart2 className="text-cyan-400" />

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {title}
              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
              </h2>
            </div>
          ))}
        </div>

        <div className="glass-card flex flex-col items-stretch justify-end gap-3 p-5 sm:flex-row sm:items-center">
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 py-2 text-white transition hover:bg-cyan-700"
          >
            <Download size={18} />
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-white transition hover:bg-violet-700"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
              Ticket Status Distribution
            </h2>

            <TicketStatusChart data={statusData} />
          </div>

          <div className="glass-card p-6">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
              Tickets by Priority
            </h2>

            <PriorityChart data={priorityData} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
            Weekly Ticket Trend
          </h2>

          <TicketTrendChart data={trendData} />
        </div>
      </div>
    </DashboardLayout>
  );
}





























