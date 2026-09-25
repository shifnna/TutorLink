import { Types } from "mongoose";
import { ApplyTutorRequestDTO } from "../dtos/tutor.dto.js";

// Trims, lowercases, and de-dupes tag fields so "Math " and "math" both
// end up stored as "math" — that consistency is what makes a later
// filter query like { subjects: "math" } actually match everything.
const normalizeTags = (input: string | string[] | undefined): string[] => {
const arr = Array.isArray(input) ? input : typeof input === "string" ? input.split(",") : [];
const seen = new Set<string>();
const result: string[] = [];
  for (const raw of arr) {
    const tag = raw.trim().toLowerCase();
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }
  return result;
};

export class TutorMapper {
    static toDomain (userId:string, dto:ApplyTutorRequestDTO){
       return {
         tutorId: new Types.ObjectId(userId),
         description: dto.description,
         languages: normalizeTags(dto.languages),
         subjects: normalizeTags(dto.subjects),
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