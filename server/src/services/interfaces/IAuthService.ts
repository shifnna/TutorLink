import { LoginRequestDTO, ResendOtpRequestDTO, ResetPasswordRequestDTO, SignupRequestDTO, VerifyOtpRequestDTO } from "../../dtos/auth.dto";
import { IUser } from "../../models/user";

export interface IAuthService{
    signup(dto:SignupRequestDTO): Promise<IUser| null>;
    verifyOtp(dto: VerifyOtpRequestDTO): Promise<{ user: IUser; refreshToken: string; accessToken:string } |{success:boolean} | null>;
    login(dto: LoginRequestDTO):Promise<{ user: IUser; refreshToken: string, accessToken: string}>;
    resendOtp(dto: ResendOtpRequestDTO):Promise<{ message: string } | null>;
    resetPassword(dto: ResetPasswordRequestDTO):Promise<{ message: string } | null>; 
}