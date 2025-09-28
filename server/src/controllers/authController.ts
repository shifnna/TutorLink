import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { IAuthController } from "./interfaces/IAuthController";
import { STATUS_CODES } from "../utils/constants";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthService) private readonly _authService: IAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const user = await this._authService.signup(name, email, password, confirmPassword);
      res.status(STATUS_CODES.CREATED).json(user);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._authService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = (req as any).user;
    res.status(STATUS_CODES.SUCCESS).json({ user });
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.status(STATUS_CODES.SUCCESS).json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, type } = req.body;
      const result = await this._authService.verifyOtp(email, otp, type);
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, type } = req.body;
      const result = await this._authService.resendOtp(email, type);
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._authService.resetPassword(email, password);
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }
}
