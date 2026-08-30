import {
  Ticket,
  Clock3,
  CheckCircle2,
  Archive,
  ShieldCheck,
  Bell,
} from "lucide-react";

import KPICard from "../analytics/KPICard";

type Props = {
  report: any;
};

export default function DashboardCards({ report }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <KPICard
        title="Open Tickets"
        value={report?.open_tickets ?? 0}
        change={8}
        icon={<Ticket className="text-white" />}
        color="bg-cyan-500"
      />

      <KPICard
        title="Pending Tickets"
        value={report?.pending_tickets ?? 0}
        change={2}
        icon={<Clock3 className="text-white" />}
        color="bg-amber-500"
      />

      <KPICard
        title="Resolved Tickets"
        value={report?.resolved_tickets ?? 0}
        change={12}
        icon={<CheckCircle2 className="text-white" />}
        color="bg-emerald-500"
      />

      <KPICard
        title="Closed Tickets"
        value={report?.closed_tickets ?? 0}
        change={6}
        icon={<Archive className="text-white" />}
        color="bg-violet-600"
      />

      <KPICard
        title="SLA Health"
        value={99}
        change={3}
        icon={<ShieldCheck className="text-white" />}
        color="bg-green-600"
      />

      <KPICard
        title="Notifications"
        value={16}
        change={4}
        icon={<Bell className="text-white" />}
        color="bg-pink-500"
      />

    </div>
  );
}




