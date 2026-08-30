import { Clock3 } from "lucide-react";

interface Event {
  action: string;
  created_at: string;
}

interface Props {
  events: Event[];
}

export default function ActivityTimeline({ events }: Props) {
  return (
    <div className="space-y-5">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-cyan-500 p-2">
              <Clock3 size={14}/>
            </div>

            {index !== events.length - 1 && (
              <div className="mt-1 h-full w-px bg-cyan-700/40"/>
            )}
          </div>

          <div className="glass-card flex-1 rounded-2xl p-4">
            <p className="font-medium text-white">
              {event.action}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {new Date(event.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}




