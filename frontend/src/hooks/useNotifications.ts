import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type Notification,
} from "../api/notificationApi";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    await markNotificationRead(id);
    reload();
  }

  async function markAllAsRead() {
    await markAllNotificationsRead();
    reload();
  }

  async function removeNotification(id: string) {
    await deleteNotification(id);
    reload();
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.is_read).length,
    loading,
    reload,
    markAsRead,
    markAllAsRead,
    deleteNotification: removeNotification,
  };
}






