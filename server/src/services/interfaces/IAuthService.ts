import { IUser } from "../../models/user";

export interface IAuthService{
    signup(name:string ,email:string ,password:string ,confirmPassword:string ): Promise<IUser| null>;
    verifyOtp(email: string, otp: string, type:string): Promise<{ user: IUser; refreshToken: string; accessToken:string } |{success:boolean} | null>;
    login(email:string,password:string):Promise<{ user: IUser; refreshToken: string, accessToken: string}>;
    resendOtp(email: string, type:string):Promise<{ message: string } | null>;
    resetPassword(email: string, password: string):Promise<{ message: string } | null>; 
}