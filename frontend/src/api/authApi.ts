import api from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface CurrentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const { data } = await api.post("/login", credentials);
  return data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await api.get("/me");
  return data;
}
