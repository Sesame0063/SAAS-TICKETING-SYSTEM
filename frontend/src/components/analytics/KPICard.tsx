import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export default function KPICard({
  title,
  value,
  change = 0,
  icon,
  color,
}: KPICardProps) {
  const positive = change >= 0;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className={`rounded-2xl p-3 ${color}`}>
          {icon}
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
          {Math.abs(change)}%
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold text-slate-800 dark:text-white">
        {value}
      </h2>
    </div>
  );
}




