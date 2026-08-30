import { useEffect, useState } from "react";
import { getProfile, type Profile } from "../api/profileApi";
import { useAppDispatch } from "./redux";
import { restoreUser, logout } from "../auth/authSlice";

export function useProfile() {
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();

      setProfile(data);
      dispatch(
        restoreUser({
          ...data,
          role: data.role.toUpperCase(),
        })
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile.");

      if (err.response?.status === 401) {
        dispatch(logout());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}

