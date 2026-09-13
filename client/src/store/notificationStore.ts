import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { INotification } from "../types/INotifications";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  setNotifications: (notifications: INotification[]) => void;
  addNotification: (notification: INotification) => void;
  markAllSeen: (userId: string) => Promise<void>;
  markOneSeen: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.seen).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.seen ? 0 : 1),
    })),

  markAllSeen: async (userId) => {
    const { notifications, unreadCount } = get();
    if (!userId || unreadCount === 0) return;

    const previous = notifications;

    // optimistic UI update
    set({
      notifications: notifications.map((n) => ({ ...n, seen: true })),
      unreadCount: 0,
    });

    try {
      await axiosClient.patch(`/api/notifications/${userId}/seen-all`);
    } catch (err) {
      console.error("Failed to persist markAllSeen, rolling back:", err);
      set({ notifications: previous, unreadCount: previous.filter((n) => !n.seen).length });
    }
  },

  markOneSeen: async (notificationId) => {
    const { notifications } = get();
    const target = notifications.find((n) => n._id === notificationId);
    if (!target || target.seen) return;

    set({
      notifications: notifications.map((n) =>
        n._id === notificationId ? { ...n, seen: true } : n
      ),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });

    try {
      await axiosClient.patch(`/api/notifications/${notificationId}/seen`);
    } catch (err) {
      console.error("Failed to persist markOneSeen:", err);
    }
  },
}));