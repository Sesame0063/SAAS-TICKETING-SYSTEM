import { Bell, Moon, Sun, UserCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleTheme } from "../../store/themeSlice";
import { useEffect } from "react";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <header className="topbar flex items-center justify-between border-b px-8 py-5">

      <input
        placeholder="Search tickets..."
        className="w-96 rounded-xl border bg-slate-100 px-5 py-3 outline-none dark:bg-slate-800"
      />

      <div className="flex items-center gap-5">

        <button
          onClick={() => dispatch(toggleTheme())}
          className="rounded-full bg-slate-100 p-3 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          {theme === "light" ? <Moon size={22}/> : <Sun size={22}/>}
        </button>

        <button className="relative rounded-full bg-slate-100 p-3 dark:bg-slate-800">
          <Bell size={22}/>
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <button className="rounded-full text-blue-600">
          <UserCircle size={40}/>
        </button>

      </div>

    </header>
  );
}
