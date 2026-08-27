import { Clock3 } from "lucide-react";

const activity = [
  ["Ticket created","Today · 10:10 AM"],
  ["Assigned to Support Agent","Today · 10:20 AM"],
  ["Status changed to In Progress","Today · 11:05 AM"],
];

export default function ActivityTimeline() {
  return (
    <div className="space-y-5">
      {activity.map(([title,time])=>(
        <div key={title} className="flex gap-4">
          <div className="mt-1 rounded-full bg-blue-100 p-2">
            <Clock3 size={16} className="text-blue-600"/>
          </div>

          <div>
            <p className="font-medium text-slate-800">{title}</p>
            <p className="text-sm text-slate-400">{time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
