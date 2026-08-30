import DashboardLayout from "../../layouts/DashboardLayout";
import FuturisticAvatar from "../../components/common/FuturisticAvatar";
import { useUsers } from "../../hooks/useUsers";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const { users } = useUsers();
  const [search, setSearch] = useState("");

  const filtered = users?.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div className="page-header">
          <p className="subtitle">TEAM MANAGEMENT</p>
          <h1>Users Workspace</h1>
          <p>Manage support agents and customers.</p>
        </div>

        <div className="glass-card p-5 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3 text-slate-500" size={18}/>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full rounded-full bg-slate-800 border border-slate-700 py-3 pl-11 pr-4 text-white"
            />
          </div>

          <button className="rounded-full bg-cyan-600 px-5 py-3 text-white flex gap-2 items-center">
            <Filter size={16}/>
            Filter
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered?.map((user)=>(
                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                  <td className="p-4 flex items-center gap-3">
                    <FuturisticAvatar size={42}/>
                    <div>
                      <p className="font-semibold text-white">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 text-slate-400">{user.email}</td>

                  <td className="p-4">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300 capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}





