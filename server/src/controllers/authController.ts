import { Request,Response } from "express";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { injectable } from "inversify";
import { IAuthController } from "./interfaces/IAuthController";

@injectable()
export class AuthController implements IAuthController{
 
  constructor(@inject(TYPES.IAuthService) private readonly authService: IAuthService){}

   async signup(req:Request,res:Response):Promise<void>{
      try {
        const {name,email,password,confirmPassword} = req.body;
        const result = await this.authService.signup(name,email,password,confirmPassword);
        res.status(201).json(result);
      } catch (error:any) {
        res.status(400).json({error:error.message})
      }
   } 
   
  
     async login(req:Request , res:Response):Promise<void>{
      try {
        const {email,password} =  req.body;
        const result = await this.authService.login(email,password);

        res.cookie("token", result.token, {
          httpOnly:true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 1000,
        })

        res.status(200).json(result);
      } catch (error:any) {
        res.status(400).json({error:error.message});
      }
    }

  
     async logout(req: Request, res: Response) {
      try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
    }


     async verifyOtp(req: Request, res: Response): Promise<void> {
      try {
      const { email, otp, type } = req.body;
      const result = await this.authService.verifyOtp(email, otp, type);
      res.status(200).json(result);
      } catch (error: any) {
      res.status(400).json({ error: error.message });
      }
    }

     async resendOtp(req: Request, res: Response): Promise<void> {
      try {
      const { email,type } = req.body;
      const result = await this.authService.resendOtp(email,type);
      res.status(200).json(result);
      } catch (error: any) {
      res.status(400).json({ error: error.message });
      }
    }

  async resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    await this.authService.resetPassword(email, password);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
  }
  
}  