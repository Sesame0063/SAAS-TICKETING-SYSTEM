interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    Open: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-orange-100 text-orange-700",
    Resolved: "bg-green-100 text-green-700",
    Closed: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
