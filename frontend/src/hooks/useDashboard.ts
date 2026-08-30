import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";
import type { DashboardStats } from "../api/dashboardApi";

export default function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    stats,
    loading,
    error,
    reload: loadDashboard,
  };
}

