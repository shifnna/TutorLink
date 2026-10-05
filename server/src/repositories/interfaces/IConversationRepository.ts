import { IConversation } from "../../models/conversation.js";

export interface IConversationRepository {
  findBetween(userA: string, userB: string): Promise<IConversation | null>;
  findOrCreateBetween(userA: string, userB: string): Promise<IConversation>;
  findForUser(userId: string): Promise<IConversation[]>;
  updateLastMessage(conversationId: string, text: string, senderId: string): Promise<void>;
  findById(id: string): Promise<IConversation | null>;
  findAdminContact(): Promise<{ _id: string; name: string; role: string } | null>;
}