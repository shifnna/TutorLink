// services/tutorService.ts
import { uploadToCloudinary } from "../config/utils/cloudinary";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { injectable } from "inversify";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { ITutor } from "../models/tutor";
import { ITutorService } from "./interfaces/ITutorService";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly tutorRepo : ITutorRepository,
    @inject(TYPES.IClientRepository) private readonly userRepo : IClientRepository
  ){}
  
  async applyTutor(tutorId: string,data: any,files: { profileImage?: Express.Multer.File; certificates?: Express.Multer.File[] }) : Promise<ITutor | null> {
    let profileImageUrl = "";
    let certificateUrls: string[] = [];

    if (files.profileImage) {
      profileImageUrl = await uploadToCloudinary(
        files.profileImage.buffer,
        files.profileImage.originalname,
        "tutors/profileImages"
      );
    }

    if (files.certificates && files.certificates.length > 0) {
      certificateUrls = await Promise.all(
        files.certificates.map((file) =>
          uploadToCloudinary(file.buffer, file.originalname, "tutors/certificates")
        )
      );
    }

    const tutor = await this.tutorRepo.create({
      tutorId,
      ...data,
      profileImage: profileImageUrl,
      certificates: certificateUrls,
    });

    await this.userRepo.findById(tutorId).then((user) => {
      if (user) {
        user.role = "tutor";
        user.tutorProfile = tutor.id;
        user.save();
      }
    });

    return tutor;
  }

}
