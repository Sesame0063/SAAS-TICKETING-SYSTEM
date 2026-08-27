import api from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/login", payload);
  return response.data;
}
