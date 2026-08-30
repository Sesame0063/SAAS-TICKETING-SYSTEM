export type UserRole = "ADMIN" | "AGENT" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  is_active: boolean;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserSearchResponse {
  users: User[];
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

