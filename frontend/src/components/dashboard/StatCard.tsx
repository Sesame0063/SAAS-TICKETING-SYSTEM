import Card from "../common/Card";
import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  color,
  icon,
}: Props) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-2 w-full ${color}`} />

      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-4xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`${color} rounded-2xl p-3 text-white`}>
          {icon}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-green-600 text-sm font-medium">
        +12% this week
        <ArrowUpRight size={16} />
      </div>
    </Card>
  );
}
