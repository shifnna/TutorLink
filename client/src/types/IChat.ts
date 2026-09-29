export interface IChatParticipant {
  _id: string;
  name: string;
  role: string;
  profileImage?: string;
}

export interface IConversationSummary {
  _id: string;
  otherUser: IChatParticipant;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface IChatMessage {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  read: boolean;
  createdAt: string;
}