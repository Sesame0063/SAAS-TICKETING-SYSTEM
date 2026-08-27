import { Search, Bell, CircleUserRound } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-2 w-96">
        <Search size={18} className="text-slate-500" />

        <input
          placeholder="Search tickets..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-slate-600" />

        <CircleUserRound size={30} className="text-blue-700" />
      </div>
    </header>
  );
}
