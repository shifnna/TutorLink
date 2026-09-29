import { inject, injectable } from "inversify";
import { MessageModel, IMessage } from "../models/message.js";
import { IMessageRepository } from "./interfaces/IMessageRepository.js";
import { BaseRepository } from "./baseRepository.js";
import { TYPES } from "../types/types.js";

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor(@inject(TYPES.IMessageModel) model: typeof MessageModel) {
    super(model);
  }

  async findByConversation(conversationId: string): Promise<IMessage[]> {
    return this.model.find({ conversationId }).sort({ createdAt: 1 });
  }

  async markAllRead(conversationId: string, readerId: string): Promise<void> {
    await this.model.updateMany(
      { conversationId, sender: { $ne: readerId }, read: false },
      { $set: { read: true } }
    );
  }

  async countUnread(conversationId: string, readerId: string): Promise<number> {
    return this.model.countDocuments({ conversationId, sender: { $ne: readerId }, read: false });
  }
}