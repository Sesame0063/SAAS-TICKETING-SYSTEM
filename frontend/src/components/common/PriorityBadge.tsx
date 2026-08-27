interface Props {
  priority: string;
}

export default function PriorityBadge({ priority }: Props) {
  const styles: Record<string, string> = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[priority] || "bg-gray-100 text-gray-600"
      }`}
    >
      {priority}
    </span>
  );
}
