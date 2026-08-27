const cards = [
  { title: "Open Tickets", value: 14, color: "bg-blue-500" },
  { title: "In Progress", value: 6, color: "bg-yellow-500" },
  { title: "Resolved", value: 28, color: "bg-green-500" },
  { title: "Closed", value: 51, color: "bg-slate-700" },
];

export default function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl bg-white p-6 shadow">
          <div className={`h-2 w-16 rounded-full ${card.color}`} />

          <p className="mt-5 text-sm text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-800">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
