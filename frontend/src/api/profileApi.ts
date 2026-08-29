import api from "./axios";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "CUSTOMER" | "AGENT" | "ADMIN";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get("/me");
  return data;
}



