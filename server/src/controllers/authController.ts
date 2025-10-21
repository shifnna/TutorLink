import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { IAuthController } from "./interfaces/IAuthController";
import { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, JwtPayload } from "../utils/tokens";
import { LoginRequestDTO, ResendOtpRequestDTO, ResetPasswordRequestDTO, SignupRequestDTO, VerifyOtpRequestDTO } from "../dtos/auth/AuthRequestDTO";
import { handleAsync } from "../utils/handleAsync";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthService)
    private readonly _authService: IAuthService
  ) {}

  signup = (req: Request, res: Response) =>
    handleAsync(() => {
        const data: SignupRequestDTO = req.body;
        return this._authService.signup(data.name,data.email,data.password,data.confirmPassword)
    })(res);


  login = async (req: Request, res: Response): Promise<void> => { 
      const data : LoginRequestDTO = req.body;
      const result = await this._authService.login( data.email, data.password);

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

      handleAsync( async ()=> result)(res);
  }
      
  
  getMe = (req: Request, res: Response) =>
    handleAsync(async() => {
      if (!req.user) throw new Error("User not authenticated");
      return req.user as IUser;
    })(res);

    
  refresh = async (req: Request, res: Response): Promise<void> =>{
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
    handleAsync(async()=> accessToken )(res);
  }

  logout = async(req: Request, res: Response): Promise<void> =>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    handleAsync(async() => ( {message: "Logged out successfully"} ))(res);
  }

  verifyOtp = async (req: Request, res: Response): Promise<void> =>{
    handleAsync(async () => {
      const data: VerifyOtpRequestDTO = req.body;
      const result = await this._authService.verifyOtp(data.email, data.otp, data.type);

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

        handleAsync(async () => ({ user: result.user, message: "OTP verified successfully" }))(res);
        return;
      }

      handleAsync(async () => result)(res); // For forgot-password OTP flow
    })(res);
  }
  

  resendOtp = (req: Request, res: Response) =>
    handleAsync(async () => {
      const data: ResendOtpRequestDTO = req.body;
      const result = await this._authService.resendOtp(data.email, data.type);
      if (!result) throw new Error("OTP could not be resent");
      return { message: result.message };
    })(res);

  resetPassword = (req: Request, res: Response) =>
    handleAsync(async () => {
      const data: ResetPasswordRequestDTO = req.body;
      const result = await this._authService.resetPassword(data.email, data.password);
      if (!result) throw new Error("Password could not be reset");
      return { message: result.message };
    })(res);


  googleSignin = async(req: Request, res: Response): Promise<void> =>{   
      const user = req.user as IUser;
      if (!user) throw new Error("Google login failed");

      const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000", 10),
      });

      res.redirect(`${process.env.CLIENT_URL}/login?googleSuccess=true`);
      return;
  }
}
