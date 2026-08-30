import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#2563eb",
  "#7c3aed",
  "#16a34a",
  "#64748b",
];

interface TicketStatusChartProps {
  data?: {
    name: string;
    value: number;
  }[];
}

export default function TicketStatusChart({
  data = [],
}: TicketStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-5 text-lg font-semibold dark:text-slate-900 dark:text-white">
          Ticket Status Distribution
        </h2>

        <div className="flex h-72 items-center justify-center text-slate-500">
          No status data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900">
      <h2 className="mb-5 text-lg font-semibold dark:text-slate-900 dark:text-white">
        Ticket Status Distribution
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: "#172554", border: "none", borderRadius: "12px", color: "#fff" }} />

            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}






