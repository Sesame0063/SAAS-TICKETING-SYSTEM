interface Props {
  priority: string;
}

export default function PriorityBadge({ priority }: Props) {
  const p = priority.toLowerCase();

  const styles: Record<string,string> = {
    critical: "bg-red-600/20 text-red-300 border-red-600/40",
    high: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    low: "bg-green-500/20 text-green-300 border-green-500/40",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[p] ?? styles.medium}`}
    >
      {priority}
    </span>
  );
}




