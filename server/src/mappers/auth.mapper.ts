import { SignupRequestDTO } from "../dtos/auth.dto";
import { IUser } from "../models/user";

export class AuthMapper {

    static toSignupDTO(dto:SignupRequestDTO,hashedPassword:string,otpCode:string,otpExpiry:Date){
        return {
            name: dto.name,
            email :dto.email,
            password: hashedPassword,
            otpCode,
            otpExpiry,
            isVerified: false,
        }
    }
}