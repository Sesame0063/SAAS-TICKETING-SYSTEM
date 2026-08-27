import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import type { Ticket } from "../../api/ticketApi";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";

interface Props{
  tickets:Ticket[];
}

export default function TicketTable({tickets}:Props){
  return(
    <div className="overflow-hidden rounded-3xl bg-white shadow-md">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-5 text-left">Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {tickets.map(ticket=>(
            <tr key={ticket.id} className="border-b hover:bg-slate-50">

              <td className="p-5">
                <p className="font-semibold">{ticket.title}</p>
                <p className="text-sm text-slate-500 truncate max-w-sm">
                  {ticket.description}
                </p>
              </td>

              <td>
                <StatusBadge status={ticket.status}/>
              </td>

              <td>
                <PriorityBadge priority={ticket.priority}/>
              </td>

              <td className="text-sm text-slate-500">
                {new Date(ticket.created_at).toLocaleDateString()}
              </td>

              <td>

                <Link to={`/tickets/${ticket.id}`}>
                  <button className="rounded-xl bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                    <Eye size={18}/>
                  </button>
                </Link>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

