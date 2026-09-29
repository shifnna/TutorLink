import { NextFunction, Request, Response } from "express";

export interface IChatController {
  getOrCreateConversation(req: Request, res: Response, next: NextFunction): void;
  getConversations(req: Request, res: Response, next: NextFunction): void;
  getMessages(req: Request, res: Response, next: NextFunction): void;
  sendMessage(req: Request, res: Response, next: NextFunction): void;
  getSupportContact(req: Request, res: Response, next: NextFunction): void;
}