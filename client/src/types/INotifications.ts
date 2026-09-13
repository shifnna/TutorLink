export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  seen: boolean;
  createdAt: string;
  updatedAt?: string;
}


export interface NotificationStore {
  notifications: INotification[];
  unreadCount: number;

  setNotifications: (list: INotification[]) => void;
  addNotification: (notification: INotification) => void;
  markAllSeen: () => void;
}
