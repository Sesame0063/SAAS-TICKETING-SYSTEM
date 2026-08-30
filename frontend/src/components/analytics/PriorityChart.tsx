import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriorityChartProps {
  data?: {
    priority: string;
    count: number;
  }[];
}

export default function PriorityChart({ data = [] }: PriorityChartProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900">
      <h2 className="mb-5 text-lg font-semibold dark:text-slate-900 dark:text-white">
        Tickets by Priority
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis tick={{ fill: "#94A3B8" }} dataKey="priority"/>
            <YAxis/>
            <Tooltip/>

            <Bar
              dataKey="count"
              fill="#06b6d4"
              radius={[8,8,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}







