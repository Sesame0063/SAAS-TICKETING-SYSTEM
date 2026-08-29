import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Users, Shield } from "lucide-react";

import { useUsers } from "../../hooks/useUsers";
import type { UserRole } from "../../types/user";

const roles: UserRole[] = ["CUSTOMER", "AGENT", "ADMIN"];

export default function UsersPage() {
  const { users, loading, updateRole, deactivate, search: searchUsers } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div className="flex items-center gap-3">
          <Users size={30} className="text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              User Management
            </h1>

            <p className="text-slate-500">
              Manage customer, agent and admin accounts.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow">
            <p className="text-sm opacity-80">Total Users</p>
            <h2 className="mt-2 text-3xl font-bold">
              {users.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white shadow">
            <p className="text-sm opacity-80">Agents</p>
            <h2 className="mt-2 text-3xl font-bold">
              {users.filter((u) => u.role === "AGENT").length}
            </h2>
          </div>

          <div className="rounded-2xl bg-purple-600 p-6 text-white shadow">
            <p className="text-sm opacity-80">Admins</p>
            <h2 className="mt-2 text-3xl font-bold">
              {users.filter((u) => u.role === "ADMIN").length}
            </h2>
          </div>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow">

          <div className="flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  searchUsers(value);
                }}
                placeholder="Search users..."
                className="w-full rounded-xl border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as UserRole | "ALL")
              }
              className="rounded-xl border px-4 py-2"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>

          </div>

        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            Loading users...
          </div>
        ) : (
          <div className="space-y-4">

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                      {user.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {user.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.is_verified
                          ? "Verified Account"
                          : "Not Verified"}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>

                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(user.id, e.target.value as UserRole)
                      }
                      className="rounded-xl border px-3 py-2"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => deactivate(user.id)}
                      disabled={!user.is_active}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white ${
                        user.is_active
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                    >
                      <Shield size={16} />
                      Deactivate
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}





