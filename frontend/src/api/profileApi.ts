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
  updated_at: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  phone?: string;
  department?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get("/me");
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const { data } = await api.put("/me", payload);
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ message: string }> {
  const { data } = await api.put("/me/password", payload);
  return data;
}
