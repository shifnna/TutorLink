import { useEffect } from "react";
import { useAuthInit } from "./hooks/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";
import { useNotificationStore } from "./store/notificationStore";
import { io, Socket } from "socket.io-client";
import axiosClient from "./api/axiosClient";
import { playNotificationSound } from "./utils/playNotificationSound";
import { INotification } from "./types/INotifications";

declare global {
  interface ImportMetaEnv {
    readonly VITE_SOCKET_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

function App() {
  const loading = useAuthInit();
  const { user } = useAuthStore();
  const { addNotification, setNotifications } = useNotificationStore();

  useEffect(() => {
    if (!user?._id) return;

    const socket: Socket = io(import.meta.env.VITE_SOCKET_URL);

    socket.emit("register-user", user._id);

    // Lives at the app root, so this fires no matter which page is open.
    socket.on("new-notification", (noti: INotification) => {
      addNotification(noti);
      playNotificationSound();
    });

    async function loadNotifications() {
      try {
        const res = await axiosClient.get(`/api/notifications/${user?._id}`);
        if (res.data?.success) {
          setNotifications(res.data.data);
        } else {
          console.error("Failed to load notifications:", res);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching notifications:", err.message);
        } else {
          console.error("Unknown error:", err);
        }
      }
    }

    loadNotifications();

    return () => {
      socket.disconnect();
    };
  }, [user, addNotification, setNotifications]);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return <AppRoutes />;
}

export default App;