import { ConversationSummaryDTO } from "../../dtos/chat.dto.js";
import { IMessage } from "../../models/message.js";
import { IConversation } from "../../models/conversation.js";

export interface IChatService {
  getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<IConversation>;
  getConversationsForUser(userId: string): Promise<ConversationSummaryDTO[]>;
  getMessages(conversationId: string, readerId: string): Promise<IMessage[]>;
  sendMessage(conversationId: string, senderId: string, text: string): Promise<IMessage>;
  getSupportContact(): Promise<{ _id: string; name: string; role: string } | null>;
}