import DashboardLayout from "../../layouts/DashboardLayout";
import { Mail, ShieldCheck, UserCircle, Calendar } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

export default function SettingsPage() {
  const { profile, loading, error, refreshProfile } = useProfile();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl bg-white p-10 text-center shadow-md">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="space-y-4 rounded-3xl bg-white p-10 shadow-md">
          <h2 className="text-xl font-bold text-red-600">
            Failed to load profile.
          </h2>

          <button
            onClick={refreshProfile}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
  Your account information from the backend.
</p>

        {error && (
          <div className="mt-4 rounded-xl bg-yellow-100 p-3 text-yellow-700">
            {error}
          </div>
        )}
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-blue-700">
              <UserCircle size={64}/>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {profile.first_name} {profile.last_name}
              </h2>

              <p className="mt-2 text-blue-100 uppercase tracking-wide">
                {profile.role}
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <InfoCard
            icon={<Mail size={22}/>}
            title="Email Address"
            value={profile.email}
          />

          <InfoCard
            icon={<ShieldCheck size={22}/>}
            title="Verification Status"
            value={profile.is_verified ? "Verified" : "Not Verified"}
          />

          <InfoCard
            icon={<UserCircle size={22}/>}
            title="Account Status"
            value={profile.is_active ? "Active" : "Inactive"}
          />

          <InfoCard
            icon={<Calendar size={22}/>}
            title="Member Since"
            value={new Date(profile.created_at).toLocaleDateString()}
          />

        </div>

      </div>
    </DashboardLayout>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({ icon, title, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-3 text-blue-600">
        {icon}
        <p className="font-medium">{title}</p>
      </div>

      <h3 className="text-lg font-semibold text-slate-800">
        {value}
      </h3>
    </div>
  );
}
