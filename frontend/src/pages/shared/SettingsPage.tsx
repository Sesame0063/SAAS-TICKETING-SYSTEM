import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProfile } from "../../hooks/useProfile";
import { useTheme } from "../../context/ThemeContext";
import { updateProfile } from "../../api/profileApi";
import {
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
  UserCircle,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
} from "lucide-react";

type NotificationSettings = {
  email: boolean;
  browser: boolean;
  assignment: boolean;
  sla: boolean;
};

export default function SettingsPage() {
  const { profile, refreshProfile } = useProfile();
  const { theme, setTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    department: "Support Team",
  });

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      email: true,
      browser: false,
      assignment: true,
      sla: true,
    });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: "",
        department: "Support Team",
      });
    }

    const savedPrefs = localStorage.getItem("notification_settings");
    if (savedPrefs) {
      setNotifications(JSON.parse(savedPrefs));
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        department: form.department,
      });

      await refreshProfile();

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (
    key: keyof NotificationSettings
  ) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);
    localStorage.setItem(
      "notification_settings",
      JSON.stringify(updated)
    );

    if (key === "browser" && updated.browser) {
      if ("Notification" in window) {
        await Notification.requestPermission();
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your TicketFlow AI account preferences.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            <CheckCircle2 size={20}/>
            Profile updated successfully.
          </div>
        )}

        <section className="rounded-3xl border border-slate-800 bg-white dark:bg-slate-900/70 p-6">
          <div className="mb-6 flex items-center gap-4">
            <UserCircle className="h-16 w-16 text-cyan-400"/>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {profile?.first_name} {profile?.last_name}
              </h2>

              <p className="text-slate-400 capitalize">
                {profile?.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <InputField
              label="First Name"
              value={form.first_name}
              onChange={(v) =>
                setForm({ ...form, first_name: v })
              }
            />

            <InputField
              label="Last Name"
              value={form.last_name}
              onChange={(v) =>
                setForm({ ...form, last_name: v })
              }
            />

            <InfoField
              label="Email"
              value={profile?.email ?? ""}
              icon={<Mail size={18}/>}
            />

            <InputField
              label="Phone (Coming Soon)"
              value={form.phone}
              placeholder="Available in a future update" disabled
              onChange={(v) =>
                setForm({ ...form, phone: v })
              }
            />

            <InputField
              label="Department (Coming Soon)"
              value={form.department}
              onChange={(v) =>
                setForm({ ...form, department: v })
              }
            />

            <InfoField
              label="Role"
              value={profile?.role ?? ""}
              icon={<Shield size={18}/>}
            />

          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-cyan-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition hover:bg-cyan-500 disabled:opacity-60 md:w-auto"
          >
            <Save size={18}/>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-white dark:bg-slate-900/70 p-6">
          <h2 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
            Notifications
          </h2>

          <ToggleRow
            title="Email Notifications"
            description="Receive updates by email."
            enabled={notifications.email}
            onToggle={() => toggleNotification("email")}
          />

          <ToggleRow
            title="Browser Notifications"
            description="Enable browser notifications."
            enabled={notifications.browser}
            onToggle={() => toggleNotification("browser")}
          />

          <ToggleRow
            title="Ticket Assignment Alerts"
            description="Notify when tickets are assigned."
            enabled={notifications.assignment}
            onToggle={() => toggleNotification("assignment")}
          />

          <ToggleRow
            title="SLA Breach Alerts"
            description="Warn when SLA deadlines approach."
            enabled={notifications.sla}
            onToggle={() => toggleNotification("sla")}
          />
        </section>

        <section className="rounded-3xl border border-slate-800 bg-white dark:bg-slate-900/70 p-6">
          <h2 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <ThemeCard
              active={theme === "dark"}
              title="Dark"
              icon={<Moon size={20}/>}
              onClick={() => setTheme("dark")}
            />

            <ThemeCard
              active={theme === "light"}
              title="Light"
              icon={<Sun size={20}/>}
              onClick={() => setTheme("light")}
            />

            <ThemeCard
              active={theme === "system"}
              title="System"
              icon={<Monitor size={20}/>}
              onClick={() => setTheme("system")}
            />

          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-white dark:bg-slate-900/70 p-6">
          <h2 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
            Security
          </h2>

          <div className="space-y-4">

            <button className="flex w-full items-center justify-between rounded-2xl bg-slate-950 p-4 transition hover:border hover:border-cyan-500/40">
              <div className="flex items-center gap-3">
                <Lock className="text-cyan-400"/>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Change Password
                  </p>
                  <p className="text-sm text-slate-400">
                    Update your account password securely.
                  </p>
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4">
              <div className="flex items-center gap-3">
                <Shield className="text-cyan-400"/>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-slate-400">
                    Coming Soon
                  </p>
                </div>
              </div>

              <button
                disabled
                className="cursor-not-allowed rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-500"
              >
                Coming Soon
              </button>
            </div>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-slate-400">{label}</p>

      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-500"
      />
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <div className="mb-2 flex items-center gap-2 text-cyan-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-950 p-4">
      <div className="flex items-center gap-3">
        <Bell className="text-cyan-400"/>

        <div>
          <p className="font-medium text-slate-900 dark:text-white">{title}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${
          enabled ? "bg-cyan-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeCard({
  title,
  icon,
  active,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 transition ${
        active
          ? "border-cyan-500 bg-cyan-500/10"
          : "border-slate-300 dark:border-slate-700 bg-slate-950 hover:border-cyan-400"
      }`}
    >
      <div className="mb-3 text-cyan-400">{icon}</div>

      <p className="font-medium text-slate-900 dark:text-white">{title}</p>
    </button>
  );
}
















