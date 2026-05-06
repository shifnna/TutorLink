import { Document, model, Schema, Types } from "mongoose";

export interface IWallet extends Document{
  userId: Types.ObjectId;
  balance: number;
  holdBalance?: number;
  transactions: IWalletTransaction[];
}

export interface IWalletTransaction {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  amount: number;
  description?: string;
  provider?: string;
  sessionId?: Types.ObjectId;
  createdAt?: Date;
}


const transactionSchema = new Schema<IWalletTransaction>({
    senderId: { type: Schema.Types.ObjectId, ref:"User", required:true },
    receiverId: { type: Schema.Types.ObjectId, ref:"User", required:true },
    amount: { type: Number, required: true },
    description: { type: String },
    provider: { type: String },
    sessionId: { type: Schema.Types.ObjectId, ref:"Session", required:true },
  },{ timestamps: true }
);


const walletSchema = new Schema<IWallet>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    holdBalance: { type: Number, default: 0 },
    transactions: [transactionSchema]
  },{ timestamps: true }
);


export const WalletModel = model<IWallet>("Wallet",walletSchema);