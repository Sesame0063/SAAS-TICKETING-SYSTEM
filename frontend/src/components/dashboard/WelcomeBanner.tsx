import { Sparkles } from "lucide-react";

export default function WelcomeBanner(){

  return(
    <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">

      <div className="flex items-center gap-3">

        <Sparkles size={30}/>

        <h2 className="text-3xl font-bold">
          Welcome back, Saswat ??
        </h2>

      </div>

      <p className="mt-3 text-blue-100">
        Monitor tickets, users, notifications and reports from one place.
      </p>

      <div className="mt-6 flex gap-4">

        <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase">Today's Tickets</p>
          <h3 className="text-2xl font-bold">18</h3>
        </div>

        <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase">SLA Alerts</p>
          <h3 className="text-2xl font-bold">3</h3>
        </div>

      </div>

    </section>
  );
}
