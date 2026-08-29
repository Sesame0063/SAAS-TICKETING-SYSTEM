import { useEffect, useState } from "react";
import { getProfile, type Profile } from "../api/profileApi";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();
      console.log("PROFILE API RESPONSE:", JSON.stringify(data, null, 2));
      setProfile(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}


