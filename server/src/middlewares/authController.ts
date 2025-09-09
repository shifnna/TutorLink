import { Request,Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authServices";

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export class AuthController{

  static async signup(req:Request,res:Response):Promise<void>{
      try {
        const {name,email,password,confirmPassword} = req.body;
        const result = await authService.signup(name,email,password,confirmPassword);
        res.status(201).json(result);
      } catch (error:any) {
        res.status(400).json({error:error.message})
      }
   } 
   
  
    static async login(req:Request , res:Response):Promise<void>{
      try {
        const {email,password} =  req.body;
        const result = await authService.login(email,password);

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

  
    static async logout(req: Request, res: Response) {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    }


    static async verifyOtp(req: Request, res: Response): Promise<void> {
      try {
      const { email, otp, type } = req.body;
      const result = await authService.verifyOtp(email, otp, type);
      res.status(200).json(result);
      } catch (error: any) {
      res.status(400).json({ error: error.message });
      }
    }

    static async resendOtp(req: Request, res: Response): Promise<void> {
      try {
      const { email,type } = req.body;
      const result = await authService.resendOtp(email,type);
      res.status(200).json(result);
      } catch (error: any) {
      res.status(400).json({ error: error.message });
      }
    }

  static async resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    await authService.resetPassword(email, password);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
  }  


}