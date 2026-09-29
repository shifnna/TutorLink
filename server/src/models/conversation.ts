import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[]; // always exactly 2
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageSender: Types.ObjectId;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSender: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>("Conversation", ConversationSchema);