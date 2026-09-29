import { inject, injectable } from "inversify";
import { ConversationModel, IConversation } from "../models/conversation.js";
import { UserModel } from "../models/user.js";
import { IConversationRepository } from "./interfaces/IConversationRepository.js";
import { BaseRepository } from "./baseRepository.js";
import { TYPES } from "../types/types.js";

@injectable()
export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository {

  constructor(
    @inject(TYPES.IConversationModel) model: typeof ConversationModel,
    @inject(TYPES.IUserModel) private readonly _userModel: typeof UserModel
  ) {
    super(model);
  }

  async findBetween(userA: string, userB: string): Promise<IConversation | null> {
    return this.model.findOne({ participants: { $all: [userA, userB], $size: 2 } });
  }

  async createBetween(userA: string, userB: string): Promise<IConversation> {
    return this.create({ participants: [userA, userB] as unknown as IConversation["participants"] });
  }

  async findForUser(userId: string): Promise<IConversation[]> {
    return this.model
      .find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name email role profileImage")
      .exec();
  }

  async updateLastMessage(conversationId: string, text: string, senderId: string): Promise<void> {
    await this.model.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
      lastMessageSender: senderId,
    });
  }

  async findById(id: string): Promise<IConversation | null> {
    return this.model.findById(id).populate("participants", "name email role profileImage");
  }

  // Reuses the already-bound UserModel — no new repository needed for this.
  async findAdminContact(): Promise<{ _id: string; name: string; role: string } | null> {
    const admin = await this._userModel.findOne({ role: "admin" }).sort({ createdAt: 1 });
    if (!admin) return null;
    return { _id: admin._id.toString(), name: admin.name, role: admin.role };
  }
}