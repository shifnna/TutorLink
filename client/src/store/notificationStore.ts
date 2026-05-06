import { create } from "zustand";
import { NotificationStore } from "../types/INotifications";


export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (list) => {
    const unread = list.filter((n) => !n.seen).length;
    set({ notifications: list, unreadCount: unread });
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAllSeen: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        seen: true,
      })),
      unreadCount: 0,
    })),
}));
