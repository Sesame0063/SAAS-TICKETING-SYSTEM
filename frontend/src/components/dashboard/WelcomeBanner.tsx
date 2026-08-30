import {
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Activity,
} from "lucide-react";
import FuturisticAvatar from "../common/FuturisticAvatar";

type WelcomeBannerProps = {
  userName: string;
  role: string;
  totalTickets: number;
  notifications: number;
};

export default function WelcomeBanner({
  userName,
  role,
  totalTickets,
  notifications,
}: WelcomeBannerProps) {

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-950 via-indigo-900 to-cyan-900 p-8 shadow-[0_25px_80px_rgba(37,99,235,.35)]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,.15),transparent_35%)]"/>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-10">

        <div className="max-w-xl space-y-5">

          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur">

            <Sparkles size={16}/>
            AI Customer Support Workspace

          </div>

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
              {greeting}
            </p>

            <h1 className="mt-2 text-5xl font-black text-white">
              Welcome Back, {userName} 👋
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-300">
              Here's everything happening across your customer support platform today.
            </p>

          </div>

          <div className="flex flex-wrap gap-3 pt-2">

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur">

              <CalendarDays size={16}/>
              {today}

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm text-emerald-300">

              <ShieldCheck size={16}/>
              System Online

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-purple-500/15 px-4 py-2 text-sm text-purple-300">

              <Activity size={16}/>
              Frontend v2.0

            </div>

          </div>

        </div>

        <div className="flex flex-col items-center gap-4">

          <div className="rounded-full border border-cyan-400/30 bg-cyan-400/5 p-3 backdrop-blur">

            <FuturisticAvatar size={120}/>

          </div>

          <span className="rounded-full bg-cyan-500/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {role}
          </span>

        </div>

      </div>

      <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-cyan-400/10 bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-cyan-100">
            Total Tickets
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {totalTickets}
          </h2>

        </div>

        <div className="rounded-2xl border border-purple-400/10 bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-purple-200">
            Notifications
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {notifications}
          </h2>

        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-emerald-200">
            Workspace
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            Production
          </h2>

        </div>

        <div className="rounded-2xl border border-orange-400/10 bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-orange-200">
            SLA Health
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            99%
          </h2>

        </div>

      </div>

    </section>
  );
}





