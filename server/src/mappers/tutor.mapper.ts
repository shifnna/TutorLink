import { Types } from "mongoose";
import { ApplyTutorRequestDTO } from "../dtos/tutor.dto";

export class TutorMapper {
    static toDomain (userId:string, dto:ApplyTutorRequestDTO){
       return {
         tutorId: new Types.ObjectId(userId),
         description: dto.description,
         languages: Array.isArray(dto.languages) ? dto.languages: dto.languages.split(",").map((s) => s.trim()),
         skills: Array.isArray(dto.skills)? dto.skills: dto.skills.split(",").map((s) => s.trim()),
         education: dto.education,
         experienceLevel: dto.experienceLevel,
         gender: dto.gender,
         occupation: dto.occupation,
         profileImage: dto.profileImage || "",
         certificates: Array.isArray(dto.certificates)
           ? dto.certificates
           : typeof dto.certificates === "string"
           ? dto.certificates.split(",").map(s => s.trim())
           : [],
         accountHolder: dto.accountHolder,
         accountNumber: String(dto.accountNumber),
         bankName: dto.bankName,
         ifsc: dto.ifsc,        
       }        
    }
}