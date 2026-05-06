export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  seen: boolean;
  link?: string;
  createdAt: string;
}


export interface NotificationStore {
  notifications: INotification[];
  unreadCount: number;

  setNotifications: (list: INotification[]) => void;
  addNotification: (notification: INotification) => void;
  markAllSeen: () => void;
}
