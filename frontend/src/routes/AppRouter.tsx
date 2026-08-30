import TicketsPage from "../pages/shared/TicketsPage";
import TicketDetailsPage from "../pages/shared/TicketDetailsPage";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

// Authentication Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Shared Pages
import DashboardPage from "../pages/shared/DashboardPage";
import NotificationsPage from "../pages/shared/NotificationsPage";
import UsersPage from "../pages/shared/UsersPage";
import KnowledgeBasePage from "../pages/shared/KnowledgeBasePage";
import ReportsPage from "../pages/shared/ReportsPage";
import SettingsPage from "../pages/shared/SettingsPage";

// Agent Pages
import AgentQueuePage from "../pages/agent/AgentQueuePage";

export default function AppRouter() {
  return (
    <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Tickets */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Agent Queue */}
        <Route
          path="/agent-queue"
          element={
            <ProtectedRoute roles={["ADMIN","AGENT"]}>
              <AgentQueuePage />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Knowledge Base */}
        <Route
          path="/knowledge-base"
          element={
            <ProtectedRoute>
              <KnowledgeBasePage />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["ADMIN","AGENT"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
  );
}









