import { useEffect, useState } from "react";
import type { User, UserQueryParams, UserRole } from "../types/user";
import {
  getUsers,
  searchUsers,
  updateUserRole,
  deactivateUser,
} from "../api/userApi";

export function useUsers(initialParams?: UserQueryParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchUsers(params?: UserQueryParams) {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers(params ?? initialParams);
      setUsers(response.users);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function search(query: string) {
    try {
      setLoading(true);
      setError("");

      if (!query.trim()) {
        await fetchUsers();
        return;
      }

      const users = await searchUsers(query);
      setUsers(users);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(userId: string, role: UserRole) {
    try {
      await updateUserRole(userId, role);

      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Role update failed.");
      throw err;
    }
  }

  async function deactivate(userId: string) {
    try {
      await deactivateUser(userId);

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? { ...user, is_active: false }
            : user
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "User deactivation failed.");
      throw err;
    }
  }

  useEffect(() => {
    fetchUsers(initialParams);
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    search,
    updateRole,
    deactivate,
  };
}






