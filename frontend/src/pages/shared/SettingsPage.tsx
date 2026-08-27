import DashboardLayout from "../../layouts/DashboardLayout";
import useProfile from "../../hooks/useProfile";
import {
  UserCircle,
  ShieldCheck,
  Mail,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, loading } = useProfile();

  return (
    <DashboardLayout>
      {loading || !profile ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          Loading profile...
        </div>
      ) : (
        <div className="space-y-8">

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600">
                {profile.first_name.charAt(0)}
                {profile.last_name.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>

                <p className="mt-2 text-blue-100">
                  {profile.email}
                </p>
              </div>

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="mb-4 flex items-center gap-3">
                <UserCircle className="text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Account Details
                </h2>
              </div>

              <div className="space-y-4 text-slate-600">

                <div className="flex justify-between">
                  <span>Name</span>
                  <span className="font-medium text-slate-800">
                    {profile.first_name} {profile.last_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="font-medium text-slate-800">
                    {profile.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Role</span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {profile.role.toUpperCase()}
                  </span>
                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="text-green-600" />
                <h2 className="text-xl font-semibold">
                  Account Status
                </h2>
              </div>

              <div className="space-y-4 text-slate-600">

                <div className="flex justify-between">
                  <span>Verified</span>

                  <span className={profile.is_verified
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"}>
                    {profile.is_verified ? "YES" : "NO"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Active</span>

                  <span className={profile.is_active
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"}>
                    {profile.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-semibold">
              Account Timeline
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-4">
                <CalendarDays className="text-blue-600" />

                <div>
                  <p className="font-medium">
                    Joined
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(profile.created_at).toLocaleString()}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-purple-600" />

                <div>
                  <p className="font-medium">
                    Email Address
                  </p>

                  <p className="text-sm text-slate-500">
                    {profile.email}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">
                <BadgeCheck className="text-green-600" />

                <div>
                  <p className="font-medium">
                    Last Updated
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(profile.updated_at).toLocaleString()}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
