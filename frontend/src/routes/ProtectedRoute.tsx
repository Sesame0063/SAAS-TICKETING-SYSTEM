import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { restoreUser, logout } from "../auth/authSlice";
import { getCurrentUser } from "../api/authApi";
import type { UserRole } from "../types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setChecking(false);
        return;
      }

      if (user) {
        setChecking(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        dispatch(
          restoreUser({
            ...currentUser,
            role: currentUser.role.toUpperCase(),
          })
        );
      } catch {
        dispatch(logout());
      } finally {
        setChecking(false);
      }
    }

    restoreSession();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && user && !roles.includes(user.role.toUpperCase() as UserRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}




