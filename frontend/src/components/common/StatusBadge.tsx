interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const s = status.toLowerCase();

  const styles: Record<string,string> = {
    open: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "in progress": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    resolved: "bg-green-500/20 text-green-300 border-green-500/30",
    closed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[s] ?? styles.open}`}
    >
      {status}
    </span>
  );
}




