import {
  Bell,
  Search,
  Moon,
  Sun,
  CircleUserRound
} from "lucide-react";

import { useDispatch,useSelector } from "react-redux";

import { toggleTheme } from "../../store/themeSlice";
import type { RootState } from "../../store/store";

export default function Topbar(){

  const dispatch=useDispatch();
  const dark=useSelector((state:RootState)=>state.theme.dark);

  return(
    <header className="flex items-center justify-between border-b bg-white px-8 py-5 shadow-sm">

      <div className="relative w-96">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          placeholder="Search tickets..."
          className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition"
        />

      </div>

      <div className="flex items-center gap-4">

        <button
          onClick={()=>dispatch(toggleTheme())}
          className="rounded-full bg-slate-100 p-3 hover:bg-slate-200"
        >
          {dark?<Sun size={20}/>:<Moon size={20}/>}
        </button>

        <button className="relative rounded-full bg-slate-100 p-3 hover:bg-slate-200">

          <Bell size={20}/>

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"/>

        </button>

        <CircleUserRound
          size={38}
          className="cursor-pointer text-blue-600"
        />

      </div>

    </header>
  );
}
