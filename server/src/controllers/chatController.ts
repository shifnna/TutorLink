import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { IChatService } from "../services/interfaces/IChatService.js";
import { IChatController } from "./interfaces/IChatController.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { handleAsync } from "../utils/handleAsync.js";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.IChatService) private readonly _chatService: IChatService) {}

  getOrCreateConversation = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const userId = (req as AuthRequest).user!.id;
      const { otherUserId } = req.body;
      return await this._chatService.getOrCreateConversation(userId, otherUserId);
    })(res, next);

  getConversations = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const userId = (req as AuthRequest).user!.id;
      return await this._chatService.getConversationsForUser(userId);
    })(res, next);

  getMessages = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const userId = (req as AuthRequest).user!.id;
      const { conversationId } = req.params;
      return await this._chatService.getMessages(conversationId, userId);
    })(res, next);

  sendMessage = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const userId = (req as AuthRequest).user!.id;
      const { conversationId, text } = req.body;
      return await this._chatService.sendMessage(conversationId, userId, text);
    })(res, next);

  getSupportContact = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      return await this._chatService.getSupportContact();
    })(res, next);
}