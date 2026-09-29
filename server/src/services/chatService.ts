import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../types/types.js";
import { IConversationRepository } from "../repositories/interfaces/IConversationRepository.js";
import { IMessageRepository } from "../repositories/interfaces/IMessageRepository.js";
import { IChatService } from "./interfaces/IChatService.js";
import { ConversationSummaryDTO } from "../dtos/chat.dto.js";
import { IMessage } from "../models/message.js";
import { IConversation } from "../models/conversation.js";
import { getIO } from "../socket.js";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.IConversationRepository) private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageRepository) private readonly _messageRepo: IMessageRepository
  ) {}

  async getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<IConversation> {
    const existing = await this._conversationRepo.findBetween(currentUserId, otherUserId);
    return existing ?? this._conversationRepo.createBetween(currentUserId, otherUserId);
  }

  async getConversationsForUser(userId: string): Promise<ConversationSummaryDTO[]> {
    const conversations = await this._conversationRepo.findForUser(userId);

    return Promise.all(
      conversations.map(async (conv) => {
        // Populate turns this into full user docs at runtime; Mongoose's
        // static types don't reflect that, hence the cast.
        const participants = conv.participants as unknown as {
          _id: Types.ObjectId; name: string; role: string; profileImage?: string;
        }[];
        const other = participants.find((p) => p._id.toString() !== userId);
        const convId = (conv._id as Types.ObjectId).toString();
        const unreadCount = await this._messageRepo.countUnread(convId, userId);

        return {
          _id: convId,
          otherUser: {
            _id: other?._id?.toString() ?? "",
            name: other?.name ?? "Unknown",
            role: other?.role ?? "client",
            profileImage: other?.profileImage,
          },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      })
    );
  }

  async getMessages(conversationId: string, readerId: string): Promise<IMessage[]> {
    const messages = await this._messageRepo.findByConversation(conversationId);
    await this._messageRepo.markAllRead(conversationId, readerId);
    return messages;
  }

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<IMessage> {
    const message = await this._messageRepo.create({
      conversationId: conversationId as unknown as Types.ObjectId,
      sender: senderId as unknown as Types.ObjectId,
      text,
    });
    await this._conversationRepo.updateLastMessage(conversationId, text, senderId);

    const conversation = await this._conversationRepo.findById(conversationId);
    const participantIds = (conversation?.participants ?? []) as unknown as { _id: Types.ObjectId }[];
    const recipientId = participantIds.map((p) => p._id.toString()).find((id) => id !== senderId);

    if (recipientId) {
      getIO().to(recipientId).emit("new-message", {
        _id: (message._id as Types.ObjectId).toString(),
        conversationId,
        sender: senderId,
        text: message.text,
        read: message.read,
        createdAt: message.createdAt,
      });
    }

    return message;
  }

  async getSupportContact(): Promise<{ _id: string; name: string; role: string } | null> {
    return this._conversationRepo.findAdminContact();
  }
}