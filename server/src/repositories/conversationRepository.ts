import { inject, injectable } from "inversify";
import { ConversationModel, IConversation } from "../models/conversation.js";
import { UserModel } from "../models/user.js";
import { IConversationRepository } from "./interfaces/IConversationRepository.js";
import { BaseRepository } from "./baseRepository.js";
import { TYPES } from "../types/types.js";

const makePairKey = (a: string, b: string) => [a, b].sort().join("_");

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
    return this.model.findOne({ pairKey: makePairKey(userA, userB) });
  }

  async createBetween(userA: string, userB: string): Promise<IConversation> {
    return this.model.create({
      pairKey: makePairKey(userA, userB),
      participants: [userA, userB],
    });
  }

  async findOrCreateBetween(userA: string, userB: string): Promise<IConversation> {
    const pairKey = makePairKey(userA, userB);
    const run = () =>
      this.model.findOneAndUpdate(
        { pairKey },
        { $setOnInsert: { pairKey, participants: [userA, userB] } },
        { upsert: true, new: true }
      );

    try {
      return (await run())!;
    } catch (err: any) {
      if (err?.code === 11000) return (await this.findBetween(userA, userB))!;
      throw err;
    }
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

  async findAdminContact(): Promise<{ _id: string; name: string; role: string } | null> {
    const admin = await this._userModel.findOne({ role: "admin" }).sort({ createdAt: 1 });
    if (!admin) return null;
    return { _id: admin._id.toString(), name: admin.name, role: admin.role };
  }
}