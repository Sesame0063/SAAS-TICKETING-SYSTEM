import DashboardLayout from "../../layouts/DashboardLayout";
import GlobalSearch from "../../components/search/GlobalSearch";

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Global Search</h1>
        <GlobalSearch />
      </div>
    </DashboardLayout>
  );
}





