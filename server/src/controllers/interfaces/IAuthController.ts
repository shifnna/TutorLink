import { NextFunction, Request, Response } from "express";

export interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleSignin(req: Request, res: Response):  Promise<void>;
  refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
}
