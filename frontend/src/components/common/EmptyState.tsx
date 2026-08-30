import { Inbox } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
}: Props) {
  return (
    <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-10 text-center">
      <div className="mb-5 rounded-full bg-cyan-500/10 p-5 text-cyan-400">
        {icon ?? <Inbox size={42} />}
      </div>

      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <p className="mt-2 max-w-md text-slate-400">
        {description}
      </p>
    </div>
  );
}




