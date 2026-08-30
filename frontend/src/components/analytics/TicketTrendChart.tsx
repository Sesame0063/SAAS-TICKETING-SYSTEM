import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TicketTrendChartProps {
  data?: {
    date: string;
    tickets: number;
  }[];
}

export default function TicketTrendChart({ data = [] }: TicketTrendChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900">
      <h2 className="mb-5 text-lg font-semibold dark:text-slate-900 dark:text-white">
        Ticket Creation Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis tick={{ fill: "#94A3B8" }} dataKey="date"/>
            <YAxis/>
            <Tooltip/>

            <Line
              type="monotone"
              dataKey="tickets"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}







