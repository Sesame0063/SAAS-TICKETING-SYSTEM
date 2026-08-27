import {
  LayoutDashboard,
  Ticket,
  Bell,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  ClipboardList,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";

type UserRole = "ADMIN" | "AGENT" | "CUSTOMER";

interface NavItem {
  name: string;
  path: string;
  icon: any;
  roles: UserRole[];
}

const links: NavItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["ADMIN", "AGENT", "CUSTOMER"],
  },
  {
    name: "Tickets",
    icon: Ticket,
    path: "/tickets",
    roles: ["ADMIN", "AGENT", "CUSTOMER"],
  },
  {
    name: "Agent Queue",
    icon: ClipboardList,
    path: "/agent-queue",
    roles: ["ADMIN", "AGENT"],
  },
  {
    name: "Users",
    icon: Users,
    path: "/users",
    roles: ["ADMIN"],
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
    roles: ["ADMIN", "AGENT", "CUSTOMER"],
  },
  {
    name: "Knowledge Base",
    icon: BookOpen,
    path: "/knowledge-base",
    roles: ["ADMIN", "AGENT", "CUSTOMER"],
  },
  {
    name: "Reports",
    icon: BarChart3,
    path: "/reports",
    roles: ["ADMIN", "AGENT"],
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ["ADMIN", "AGENT", "CUSTOMER"],
  },
];

export default function Sidebar() {
  const role = useMemo<UserRole>(() => {
    const savedRole =
      (localStorage.getItem("user_role") as UserRole | null) ??
      "CUSTOMER";

    return savedRole;
  }, []);

  const filteredLinks = links.filter((link) =>
    link.roles.includes(role)
  );

  const initials =
    localStorage.getItem("user_name")
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SM";

  const username =
    localStorage.getItem("user_name") || "Saswat Mohanty";

  return (
    <aside className="flex w-64 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

      <div className="border-b border-slate-800 p-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold leading-tight text-blue-400">
              SAAS Ticketing
            </h1>

            <p className="mt-2 text-xs text-slate-400">
              Customer Support System
            </p>
          </div>

          <ChevronLeft size={18} />
        </div>

      </div>

      <div className="border-b border-slate-800 px-6 py-4">

        <div className="flex items-center gap-3">

          <ShieldCheck size={20} className="text-green-400" />

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Logged in as
            </p>

            <p className="font-semibold text-green-400">
              {role}
            </p>
          </div>

        </div>

      </div>

      <nav className="flex-1 space-y-2 px-3 py-5">

        {filteredLinks.map(({ name, icon: Icon, path }) => (
          <NavLink key={path} to={path}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                {name}
              </motion.div>
            )}
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-slate-800 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {username}
            </p>

            <p className="text-xs uppercase text-slate-400">
              {role}
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}
