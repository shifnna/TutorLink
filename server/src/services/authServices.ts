import { IUser } from "../models/user";
import { IUserRepository } from "../repositories/userRepository";
import { MESSAGES } from "../utils/constants";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/mailer";


export class AuthService{
    private userRepo : IUserRepository;

    constructor(userRepo:IUserRepository){
        this.userRepo = userRepo;
    }

    async signup(name:string ,email:string ,password:string ,confirmPassword:string ){
        if (!name || !email || !password || !confirmPassword) {
            throw new Error(MESSAGES.COMMON.ERROR.MISSING_FIELDS)
        }
        
        if (name.trim().length < 3) {
            throw new Error(MESSAGES.COMMON.ERROR.INVALID_NAME);
        }
        
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            throw new Error(MESSAGES.COMMON.ERROR.INVALID_EMAIL);
        }

        if(password!==confirmPassword){
            throw new Error(MESSAGES.COMMON.ERROR.PASSWODS_MISSMATCH)
        }
        if (password.length < 6) {
            throw new Error(MESSAGES.COMMON.ERROR.WEAK_PASSWORD);
        }

        const existingUser = await this.userRepo.findByEmail(email);
        if(existingUser){
            throw new Error(MESSAGES.COMMON.ERROR.EMAIL_IN_USE);
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        const user:IUser = await this.userRepo.create({
            name,
            email,
            password:hashedPassword,
            otpCode,
            otpExpiry,
            isVerified: false,
        } as IUser);

        await sendOTP(user.email, otpCode);

        return user;
    }


async verifyOtp(email: string, otp: string) {
  const user = await this.userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

  if (user.isVerified) throw new Error("Already verified");
  if (user.otpCode !== otp || new Date() > user.otpExpiry!)
    throw new Error("Invalid or expired OTP");

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return { user, token };
}

    async login(email:string,password:string){
        if(!email || !password) throw new Error(MESSAGES.COMMON.ERROR.MISSING_FIELDS);
        
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) throw new Error(MESSAGES.COMMON.ERROR.INVALID_EMAIL);
        
        const user = await this.userRepo.findByEmail(email)
        if(!user) throw new Error(MESSAGES.COMMON.ERROR.INVALID_CREDENTIALS);

        const isPasswordVaild = await bcrypt.compare(password,user.password)
        if(!isPasswordVaild) throw new Error(MESSAGES.COMMON.ERROR.INVALID_CREDENTIALS);

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET as string,{
            expiresIn:'1h',
        });

        return {user,token};
    }
}