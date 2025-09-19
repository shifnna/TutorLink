import axiosClient from "../api/anxiosClient";
import { S3UploadResponse, TutorApplication } from "../types/tutor";

export const tutorRepository = {
    // get pre-signed URL from backend
    getPresignedUrl : async (fileName:string,fileType:string): Promise <S3UploadResponse> =>{
        const {data} = await axiosClient.post("/api/upload/presign", {fileName,fileType});
        return data;
    },

    applyForTutor : async (payload : TutorApplication) =>{
        const {data} = await axiosClient.post("/api/user/apply-for-tutor",payload);
        return data;
    }
}