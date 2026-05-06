import { IUser } from "../models/user";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import bcrypt from "bcryptjs";
import { sendOTP } from "../config/mailer";
import { injectable } from "inversify";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "./interfaces/IAuthService";
import { COMMON_ERROR } from "../utils/constants";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { WalletModel } from "../models/wallet";
import { LoginRequestDTO, ResendOtpRequestDTO, ResetPasswordRequestDTO, SignupRequestDTO, VerifyOtpRequestDTO } from "../dtos/auth.dto";
import { AuthMapper } from "../mappers/auth.mapper";

@injectable()
export class AuthService implements IAuthService{
    constructor( @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository){}

    async signup(dto:SignupRequestDTO): Promise<IUser | null>{
        const existingUser = await this._userRepo.findByEmail(dto.email);
        if(existingUser){
            throw new Error(COMMON_ERROR.EMAIL_IN_USE);
        }

        const hashedPassword = await bcrypt.hash(dto.password,10);

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpExpiry = new Date(Date.now() + 60 * 1000); // 1 mins expiry

        const mappedData = AuthMapper.toSignupDTO(dto,hashedPassword,otpCode,otpExpiry)

        const user:IUser = await this._userRepo.create(mappedData);

        await sendOTP(user.email, otpCode);

        return user;
    }


    async verifyOtp(dto:VerifyOtpRequestDTO): Promise<{ user: IUser; refreshToken: string; accessToken:string } | {success:boolean} | null> {
        const user = await this._userRepo.findByEmail(dto.email);
        if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

        if (user.otpCode !== dto.otp || new Date() > user.otpExpiry!)
        throw new Error("Invalid or expired OTP");

        user.otpCode = undefined;
        user.otpExpiry = undefined;

        if(dto.type==="signup"){
            if (user.isVerified) throw new Error(COMMON_ERROR.ALREADY_VERIFIED);
            user.isVerified = true;
            await user.save();
            
            await WalletModel.create({
               userId: user._id,
               balance: 0,
               transactions: [],
            });

          return { user, refreshToken:generateRefreshToken({id:user.id,role:user.role}), accessToken:generateAccessToken({id:user.id,role:user.role}) };
        }
  
        if(dto.type==="forgot"){
           await user.save();
           return { success: true };
        } 
  
        throw new Error("Invalid verification type");
    }


    async login(dto: LoginRequestDTO):Promise<{ user: IUser; refreshToken: string, accessToken: string }>{
        const user = await this._userRepo.findByEmail(dto.email)
        if(!user) throw new Error(COMMON_ERROR.INVALID_CREDENTIALS);

        const isPasswordVaild = await bcrypt.compare(dto.password,user.password)
        if(!isPasswordVaild) throw new Error(COMMON_ERROR.INVALID_CREDENTIALS);

        return {user,refreshToken:generateRefreshToken({id:user.id,role:user.role}),accessToken:generateAccessToken({id:user.id,role:user.role})};
    }


    async resendOtp(dto: ResendOtpRequestDTO):Promise<{ message: string } | null> {
            const user = await this._userRepo.findByEmail(dto.email);
            if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

            if (dto.type === "signup" && user.isVerified) {
            throw new Error(COMMON_ERROR.ALREADY_VERIFIED);
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
            const newExpiry = new Date(Date.now() +  60 * 1000);

            user.otpExpiry = newExpiry;
            user.otpCode = otpCode;
            user.save();

            await sendOTP(user.email,otpCode);
            return { message: "OTP resent successfully" };
    }

    
    async resetPassword(dto: ResetPasswordRequestDTO):Promise<{ message: string } | null> {
        const user = await this._userRepo.findByEmail(dto.email);
        if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

        user.password = await bcrypt.hash(dto.password, 10);
        await user.save();

        return { message: "Password reset successful" };
    }

}