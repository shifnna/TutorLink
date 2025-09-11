// services/tutorService.ts
import { TutorRepository } from "../repositories/tutorRepository";
import { UserRepository } from "../repositories/userRepository";
import { uploadToCloudinary } from "../config/utils/cloudinary";

const tutorRepo = new TutorRepository();
const userRepo = new UserRepository();

export class TutorService {
  async applyTutor(
    userId: string,
    data: any,
    files: { profileImage?: Express.Multer.File; certificates?: Express.Multer.File[] }
  ) {
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

    const tutor = await tutorRepo.create({
      userId,
      ...data,
      profileImage: profileImageUrl,
      certificates: certificateUrls,
    });

    await userRepo.findById(userId).then((user) => {
      if (user) {
        user.role = "tutor";
        user.tutorProfile = tutor.id;
        user.save();
      }
    });

    return tutor;
  }

  async getTutorByUserId(userId: string) {
    return await tutorRepo.findByUserId(userId);
  }
}
