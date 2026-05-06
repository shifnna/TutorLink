import { injectable } from "inversify";
import { ISessionController } from "./interfaces/ISessionController";
import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../utils/handleAsync";
import { TYPES } from "../types/types";
import { ISessionService } from "../services/interfaces/ISessionService";
import { inject } from "inversify";
import { AuthRequest } from "../middlewares/authMiddleware";

@injectable()
export class SessionController implements ISessionController{
    constructor(
        @inject(TYPES.ISessionService) private readonly _sessionService : ISessionService,
    ){}
   
  bookSession = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
    const order = this._sessionService.bookSession(req.body.amount);
    return { success: true, message: "Order created", data: order };
    })(res, next); 

    
  verifyPayment = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const {user} = req.user as AuthRequest;
      const userId = user?._id as string;

      const session = await this._sessionService.verifyPayment(req.body,userId);
      return {success: true,message: "Payment verified, session created",data: { sessionId: session._id } };
    })(res, next);
    

  getAllSessions = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { userId } = req.params;
      const sessions = await this._sessionService.getSessionsByUserId(userId);
      return { success: true, message: "Fetched user sessions", data: sessions };
    })(res, next);


  cancelSession = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { id } = req.params;
      await this._sessionService.cancelSession(id);
      return { success: true, message: "Session cancelled successfully" };
    })(res, next);

  sentFeedback = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async()=>{ 
      return this._sessionService.sentFeedback(req.body);
    })(res, next);
}