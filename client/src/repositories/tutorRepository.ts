import axiosClient from "../api/axiosClient";
import { IS3UploadResponse, ITutorApplication } from "../types/ITutorApplication";

export const tutorRepository = {
    
    getPresignedUrl : async (fileName:string,fileType:string): Promise <IS3UploadResponse> =>{
        const {data} = await axiosClient.post("/api/user/upload/presign", {fileName,fileType});
        return data;
    },

    applyForTutor : async (payload : ITutorApplication | FormData) =>{
        const {data} = await axiosClient.post("/api/user/apply-for-tutor",payload);
        return data;
    }
}