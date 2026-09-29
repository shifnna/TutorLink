export interface ConversationSummaryDTO {
  _id: string;
  otherUser: { _id: string; name: string; role: string; profileImage?: string };
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}