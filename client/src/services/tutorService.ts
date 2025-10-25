import axiosClient from "../api/axiosClient";
import { uploadFileToS3 } from "../api/uploadToS3";
import { ITutor } from "../types/ITutor";
import { IS3UploadResponse, ITutorApplication, ITutorApplicationForm } from "../types/ITutorApplication";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import { ROUTES } from "../utils/constants";

export const tutorService = {
    
    getPresignedUrl : async (fileName:string,fileType:string): Promise <ICommonResponse<IS3UploadResponse>> => ////last promise optional (not set in authservice)
      handleApi<IS3UploadResponse>(axiosClient.post( `${ROUTES.TUTOR_API}/upload/presign`, {fileName,fileType})),
        

    applyForTutor: async (payload: ITutorApplication | FormData): Promise<ICommonResponse<ITutorApplication>> =>
      handleApi<ITutorApplication>(axiosClient.post( `${ROUTES.TUTOR_API}/apply-for-tutor`, payload)),


    getAllTutors: async () : Promise <ICommonResponse<ITutor[]>> =>
      handleApi<ITutor[]>(axiosClient.get( `${ROUTES.TUTOR_API}/get-tutors`)),
    

    apply: async (formData: ITutorApplicationForm):  Promise<ICommonResponse<ITutorApplication>> => {
      if (!formData.profileImage) {
       throw new Error("Profile image is required");
      }

      // upload profile image
      const profileImageUrl = await uploadFileToS3(formData.profileImage);

      // upload certificates
      const certificatesUrls: string[] = await Promise.all(
        formData.certificates.map(file => uploadFileToS3(file))
      );

      // build final payload as Partial
    const payload: Partial<ITutorApplication> = {
      description: formData.description,
      languages: formData.languages,
      education: formData.education,
      skills: formData.skills,
      experienceLevel: formData.experienceLevel,
      gender: formData.gender,
      occupation: formData.occupation,
      profileImage: profileImageUrl,
      certificates: certificatesUrls,
      accountHolder: formData.accountHolder,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      ifsc: formData.ifsc,
    };
    return tutorService.applyForTutor(payload as ITutorApplication);
}

}