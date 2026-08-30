import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import GlobalSearch from "../components/search/GlobalSearch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#020817]">

      <Sidebar/>

      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar/>

        <GlobalSearch/>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#020817] via-[#071126] to-[#0F172A] p-8 text-white">
          {children}
        </main>

      </div>

    </div>
  );
}





