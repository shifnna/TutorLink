import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { IAuthController } from "./interfaces/IAuthController";
import { STATUS_CODES } from "../utils/constants";
import { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthService)
    private readonly _authService: IAuthService
  ) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const user = await this._authService.signup(name, email, password, confirmPassword);
      res.status(STATUS_CODES.CREATED).json(user);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this._authService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.MAX_AGE || "604800000", 10),
      });

      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    res.status(STATUS_CODES.SUCCESS).json({ user });
  };

  refresh = async (req: Request, res: Response): Promise< void> => {
    try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token" });
      return;
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const accessToken = generateAccessToken({ id: (decoded as any).id, role: (decoded as any).role })

    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken");
    res.status(STATUS_CODES.SUCCESS).json({ message: "Logged out successfully" });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, type } = req.body;
      const result = await this._authService.verifyOtp(email, otp, type);

      if (!result) {
        res.status(400).json({ error: "Verification failed" });
        return;
      }

      if ("refreshToken" in result) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.MAX_AGE || "604800000", 10)
      });
      //// Send full result (user + tokens)
      res.status(STATUS_CODES.SUCCESS).json(result);
      return;
    }

    //// for forgot-password OTP
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };
  

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, type } = req.body;
      const result = await this._authService.resendOtp(email, type);
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this._authService.resetPassword(email, password);
      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };

  googleSignin = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Google login failed" });
        return;
      }

      const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
      const accessToken = generateAccessToken({ id: user.id, role: user.role });

      res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.MAX_AGE || "604800000", 10),
     });

      res.redirect(`${process.env.CLIENT_URL}/login?googleSuccess=true&accessToken=${accessToken}`);
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  };
}
