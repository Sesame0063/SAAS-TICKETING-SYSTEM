import { useEffect, useState } from "react";
import type { Profile } from "../api/profileApi";
import { getProfile } from "../api/profileApi";

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await getProfile();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { profile, loading, refresh };
}
