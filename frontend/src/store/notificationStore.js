import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],

  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter(
        (n) => !n.read
      ).length,
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications:
        state.notifications.map((item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item
        ),

      unreadCount:
        state.unreadCount > 0
          ? state.unreadCount - 1
          : 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));

export default useNotificationStore;