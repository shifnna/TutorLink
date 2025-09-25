import axiosClient from "../api/axiosClient";
import { uploadFileToS3 } from "../api/uploadToS3";
import { IS3UploadResponse, ITutorApplication } from "../types/ITutorApplication";

export const tutorService = {
    
    getPresignedUrl : async (fileName:string,fileType:string): Promise <IS3UploadResponse> =>{
        const {data} = await axiosClient.post("/api/tutor/upload/presign", {fileName,fileType});
        return data;
    },

    applyForTutor : async (payload : ITutorApplication | FormData) =>{
        const {data} = await axiosClient.post("/api/tutor/apply-for-tutor",payload);
        return data;
    },

    getAllTutors: async () => {
        const response = await axiosClient.get("/api/tutor/get-tutors");
        return response.data.tutors;
    },
    

    apply: async (formData:any) => {
        // upload profile image
        const profileImageUrl = formData.profileImage ? await uploadFileToS3(formData.profileImage) : null;

        // upload certificates
        const certificatesUrls: string[] = [];
        if(formData.certificates.length){
            for(const file of formData.certificates){
                const url = await uploadFileToS3(file);
                certificatesUrls.push(url);
            }
        }

        // build final payload
        const payload: ITutorApplication = {
            ...formData,
            profileImage : profileImageUrl,
            certificates : certificatesUrls, 
        }

        return tutorService.applyForTutor(payload);
    }
}