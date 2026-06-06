import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { IAuthController } from "./interfaces/IAuthController";
import { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, JwtPayload } from "../utils/tokens";
import { handleAsync } from "../utils/handleAsync";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthService)
    private readonly _authService: IAuthService
  ) {}

  signup = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(() => this._authService.signup(req.body))(res,next);


  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
      const result = await this._authService.login(req.body);

      const accessToken = result.accessToken;
      const refreshToken = result.refreshToken;

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "900000", 10),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000", 10),
      });

      handleAsync(async ()=> result)(res,next);
  }
      
  

  googleSignin = async(req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;

    if (!user) {
      throw new Error("Google login failed");
    }

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "900000", 10),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000", 10),
    });

    res.redirect(`${process.env.CLIENT_URL}/login?googleSuccess=true`);
}


  getMe = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async() => {
      if (!req.user) throw new Error("User not authenticated");
      return req.user as IUser;
    })(res,next);

    
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) throw new Error("No refresh token");

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
      const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "900000", 10),
      });
    handleAsync(async()=> accessToken )(res,next);
  }

  logout = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    handleAsync(async() => ( {message: "Logged out successfully"} ))(res,next);
  }

  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    handleAsync(async () => {
      const result = await this._authService.verifyOtp(req.body);

      if (!result) throw new Error("Verification failed");

      if ("accessToken" in result && "refreshToken" in result) {
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "900000", 10),
        });

        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000", 10),
        });

        handleAsync(async () => ({ user: result.user, message: "OTP verified successfully" }))(res,next);
        return;
      }

      handleAsync(async () => result)(res,next); // For forgot-password OTP flow
    })(res,next);
  }
  

  resendOtp = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const result = await this._authService.resendOtp(req.body);
      if (!result) throw new Error("OTP could not be resent");
      return { message: result.message };
    })(res,next);

  resetPassword = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const result = await this._authService.resetPassword(req.body);
      if (!result) throw new Error("Password could not be reset");
      return { message: result.message };
    })(res,next);

}
