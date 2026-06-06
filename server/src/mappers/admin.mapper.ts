import { IUserWithTutorDTO } from "../dtos/tutor.dto";
import { ITutor } from "../models/tutor";
import { IUser } from "../models/user";

export class AdminMapper {

  static toTutorDTO(user:IUser, tutorProfile: ITutor | null, profileImageUrl: string | null, certificates: string[]): IUserWithTutorDTO {
    const userObj = user.toObject();
    return {
      id: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      isBlocked: userObj.isBlocked,
      isVerified: userObj.isVerified,
      createdAt: userObj.createdAt,
      profileImage: profileImageUrl || userObj.profileImage || null,
      tutorProfile: tutorProfile
        ? {
            ...("toObject" in tutorProfile ? tutorProfile.toObject() : tutorProfile),
            profileImage: profileImageUrl,
            certificates,
          }
        : null,
    };
  }

  static toClientDTO(user:IUser): IUserWithTutorDTO{
    const userObj = user.toObject();
    return {
      id: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      isBlocked: userObj.isBlocked || false,
      isVerified: userObj.isVerified,
      createdAt: userObj.createdAt,
      profileImage: userObj.profileImage || null,
      tutorProfile: null, 
    };
  }
}