import { IMessage } from "../../models/message.js";

export interface IMessageRepository {
  create(data: Partial<IMessage>): Promise<IMessage>;
  findByConversation(conversationId: string): Promise<IMessage[]>;
  markAllRead(conversationId: string, readerId: string): Promise<void>;
  countUnread(conversationId: string, readerId: string): Promise<number>;
}