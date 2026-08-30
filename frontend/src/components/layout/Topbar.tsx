import { useState } from "react";
import type { KeyboardEvent } from "react";
import NotificationDropdown from "../notifications/NotificationDropdown";
import { Bell, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [openNotifications, setOpenNotifications] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== "Enter") return;

  const query = searchQuery.trim();

  if (!query) return;

  window.dispatchEvent(new CustomEvent("global-search", { detail: query }));
};
  const navigate = useNavigate();
  const unread = Number(localStorage.getItem("unread_notifications") ?? "4");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-[#07111F]/80 px-8 backdrop-blur-xl">
      <div className="flex w-[340px] items-center gap-3 rounded-full border border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 focus-within:border-cyan-500">
        <Search size={18} className="text-slate-400"/>
        <input
          type="text"
          placeholder="Search tickets, users, articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none"
        />
      </div>

      <NotificationDropdown open={openNotifications} />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpenNotifications(!openNotifications)}
          className="relative rounded-full border border-slate-700 bg-slate-100 dark:bg-slate-900 p-3 hover:border-cyan-500"
        >
          <Bell size={20} className="text-cyan-400"/>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-slate-900 dark:text-white">
              {unread}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="rounded-full border border-slate-700 bg-slate-100 dark:bg-slate-900 p-3 hover:border-cyan-500"
        >
          <Settings size={20} className="text-cyan-400"/>
        </button>
      </div>
    </header>
  );
}






























