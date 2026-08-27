import api from "./axios";
import type { User, UserQueryParams, UserRole } from "../types/user";

export async function getUsers(
  params?: UserQueryParams
): Promise<{ users: User[] }> {
  const { data } = await api.get("/users", { params });
  return { users: Array.isArray(data) ? data : data.users };
}

export async function getAgents(): Promise<User[]> {
  const { data } = await api.get("/users", {
    params: { role: "AGENT" },
  });
  return Array.isArray(data) ? data : data.users;
}

export async function searchUsers(query: string): Promise<User[]> {
  const { data } = await api.get("/search/users", {
    params: { q: query },
  });
  return Array.isArray(data) ? data : data.users;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User> {
  const { data } = await api.patch(`/users/${userId}/role`, {
    role: role.toLowerCase(),
  });
  return data;
}

export async function deactivateUser(userId: string): Promise<User> {
  const { data } = await api.patch(`/users/${userId}/deactivate`);
  return data;
}
