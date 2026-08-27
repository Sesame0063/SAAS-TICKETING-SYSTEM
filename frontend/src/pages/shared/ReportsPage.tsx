import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useReports } from "../../hooks/useReports";

export default function ReportsPage() {
  const {
    summary,
    statusDistribution,
    priorityDistribution,
    agentReport,
    customerReport,
    loading,
    error,
    downloadCsv,
    downloadPdf,
  } = useReports();

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-lg">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Analytics for tickets, agents and customers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadCsv}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            <FileSpreadsheet size={18} />
            Export CSV
          </button>

          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            <FileText size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard title="Total Tickets" value={summary.total_tickets} color="bg-blue-600" />
          <SummaryCard title="Open Tickets" value={summary.open_tickets} color="bg-red-600" />
          <SummaryCard title="In Progress" value={summary.in_progress_tickets} color="bg-yellow-500" />
          <SummaryCard title="Pending Tickets" value={summary.pending_tickets} color="bg-orange-500" />
          <SummaryCard title="Resolved Tickets" value={summary.resolved_tickets} color="bg-green-600" />
          <SummaryCard title="Closed Tickets" value={summary.closed_tickets} color="bg-slate-700" />
        </div>
      )}

      {/* Ticket Status */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">
          Ticket Status Distribution
        </h2>

        <div className="space-y-3">
          {(statusDistribution ?? []).map((status) => (
            <div
              key={status.status}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="font-medium capitalize">{status.status}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                {status.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">
          Priority Distribution
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {(priorityDistribution ?? []).map((priority) => (
            <div
              key={priority.priority}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <span className="font-medium capitalize">{priority.priority}</span>

              <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">
                {priority.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Report */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">
          Agent Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Agent</th>
                <th className="p-3 text-center">Assigned</th>
                <th className="p-3 text-center">Resolved</th>
                <th className="p-3 text-center">Pending</th>
              </tr>
            </thead>

            <tbody>
              {(agentReport ?? []).map((agent) => (
                <tr key={agent.agent_id} className="border-b">
                  <td className="p-3 font-medium">{agent.agent_name}</td>
                  <td className="p-3 text-center">{agent.assigned_tickets}</td>
                  <td className="p-3 text-center text-green-600">
                    {agent.resolved_tickets}
                  </td>
                  <td className="p-3 text-center text-orange-600">
                    {agent.pending_tickets}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Report */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">
          Customer Report
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-center">Total Tickets</th>
                <th className="p-3 text-center">Resolved Tickets</th>
              </tr>
            </thead>

            <tbody>
              {(customerReport ?? []).map((customer) => (
                <tr key={customer.customer_id} className="border-b">
                  <td className="p-3 font-medium">{customer.customer_name}</td>
                  <td className="p-3 text-center">{customer.total_tickets}</td>
                  <td className="p-3 text-center text-green-600">
                    {customer.resolved_tickets}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
}

function SummaryCard({ title, value, color }: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h3>
        </div>

        <div className={`${color} rounded-xl p-3 text-white`}>
          <Download size={24} />
        </div>
      </div>
    </div>
  );
}

