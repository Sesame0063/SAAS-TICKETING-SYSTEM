import { useEffect, useState } from "react";
import type { Notification } from "../api/notificationApi";
import { getNotifications, markNotificationRead, deleteNotification } from "../api/notificationApi";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    await markNotificationRead(id);
    await refresh();
  }

  async function remove(id: string) {
    await deleteNotification(id);
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return { notifications, loading, refresh, markRead, remove };
}

