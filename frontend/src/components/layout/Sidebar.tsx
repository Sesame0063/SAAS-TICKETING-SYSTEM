import {
  LayoutDashboard,
  Ticket,
  Bell,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Tickets", icon: Ticket, path: "/tickets" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
  { name: "Users", icon: Users, path: "/users" },
  { name: "Knowledge Base", icon: BookOpen, path: "/knowledge-base" },
  { name: "Reports", icon: BarChart3, path: "/reports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };
  return (
    <aside className="sticky top-0 flex h-screen w-[270px] flex-col border-r border-slate-800 bg-[#030712]/95 backdrop-blur-xl">

      <div className="border-b border-slate-800 p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-500/30">
            <Bot className="text-white" size={24}/>
          </div>

          <div>
            <h1 className="text-xl font-black text-white">
              TicketFlow AI
            </h1>

            <p className="text-xs text-cyan-300">
              Customer Support Platform
            </p>

          </div>

        </div>

      </div>

      <nav className="flex-1 space-y-2 p-4">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-lg shadow-cyan-500/10 border border-cyan-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={20}/>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-slate-800 p-4">

        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-400 transition hover:bg-red-500/10">
          <LogOut size={20}/>
          Logout
        </button>

      </div>

    </aside>
  );
}














