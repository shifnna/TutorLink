import axiosClient from "../api/axiosClient";
import { uploadToCloudinary } from "../api/uploadToCloudinary";
import { ITutor,ITutorSearch } from "../types/ITutor";
import { ITutorApplication, ITutorApplicationForm } from "../types/ITutorApplication";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import { ROUTES } from "../utils/constants";

export const tutorService = {

    applyForTutor: async (payload: ITutorApplication | FormData): Promise<ICommonResponse<ITutorApplication>> =>
      handleApi<ITutorApplication>(axiosClient.post( `${ROUTES.TUTOR_API}/apply-for-tutor`, payload)),

    getTutorById: async (tutorId: string) : Promise <ICommonResponse<ITutor>> =>
      handleApi<ITutor>(axiosClient.get(`${ROUTES.TUTOR_API}/get-tutor/${tutorId}`)),
    
    getTutorProfile: async (): Promise<ICommonResponse<ITutorApplication>> => {
      const response = await handleApi<{ success: boolean; message: string; data: ITutorApplication }>(axiosClient.get(`${ROUTES.TUTOR_API}/profile`));
      return {
        ...response,
        data: response.data?.data || null,
      };
    },
    

    getAllTutors: async (params: ITutorSearch): Promise<ICommonResponse<ITutor[]>> => {
    const query = new URLSearchParams();
  if (params.search) {
    query.append("search", params.search);
  }

  if (params.experienceLevels?.length) {
    query.append(
      "experienceLevels",
      params.experienceLevels.join(",")
    );
  }

  if (params.minPrice !== undefined) {
    query.append(
      "minPrice",
      params.minPrice.toString()
    );
  }

  if (params.maxPrice !== undefined) {
    query.append(
      "maxPrice",
      params.maxPrice.toString()
    );
  }

  if (params.sortBy) {
    query.append("sortBy", params.sortBy);
  }

  return handleApi<ITutor[]>( axiosClient.get(`${ROUTES.TUTOR_API}/get-tutors?${query.toString()}`)
  );
},

    apply: async (formData: ITutorApplicationForm): Promise<ICommonResponse<ITutorApplication>> => {
    try {
    if (!formData.profileImage) throw new Error("Profile image is required");
    const profileImageUrl = await uploadToCloudinary(formData.profileImage);
    const certificatesUrls: string[] = await Promise.all(
      formData.certificates.map(file => uploadToCloudinary(file))
    );

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
  } catch (err) {
    console.error("Error applying for tutor:", err);
    return { success: false, message: "File upload failed", data: null };
  }
},


}