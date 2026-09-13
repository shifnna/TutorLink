import { injectable } from "inversify";
import { ISessionController } from "./interfaces/ISessionController.js";
import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../utils/handleAsync.js";
import { TYPES } from "../types/types.js";
import { ISessionService } from "../services/interfaces/ISessionService.js";
import { inject } from "inversify";
import { AuthRequest } from "../middlewares/authMiddleware.js";

@injectable()
export class SessionController implements ISessionController{
    constructor(
        @inject(TYPES.ISessionService) private readonly _sessionService : ISessionService,
    ){}
   
  bookSession = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
    const order = await this._sessionService.bookSession(req.body.amount);
    return { success: true, message: "Order created", data: order };
    })(res, next); 

    
  verifyPayment = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const {user} = req as AuthRequest;
      const userId = user?._id as string;

      const session = await this._sessionService.verifyPayment(req.body,userId);
      return {success: true,message: "Payment verified, session created",data: { sessionId: session._id } };
    })(res, next);
    

 getAllSessions = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  handleAsync(async () => {

    const { user } =
      req as AuthRequest;

    if (!user) {
      throw new Error(
        "Unauthorized"
      );
    }

    const sessions =
      await this._sessionService.getSessionsByUserId(
        String(user._id),
        String(user.role)
      );

    return {
      success: true,
      message:
        "Fetched sessions",
      data: sessions,
    };
  })(res, next);


  getSessionById = (req: Request, res: Response, next: NextFunction) =>
  handleAsync(async () => {
    const { id } = req.params;
    const session = await this._sessionService.getSessionById(id);
    return { success: true, message: "Fetched session", data: session };
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