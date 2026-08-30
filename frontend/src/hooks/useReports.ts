import { useEffect, useState } from "react";
import {
  getDashboardReport,
  type DashboardReport,
} from "../api/reportsApi";

export default function useReports() {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reload() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardReport();
      setReport(data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    report,
    loading,
    error,
    reload,
  };
}

