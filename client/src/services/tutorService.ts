import { tutorRepository } from "../repositories/tutorRepository";
import { TutorApplication } from "../types/tutor";


async function uploadFileToS3 (file:File) : Promise<string> {
    // Step 1: Get presigned URL
    const presigned = await tutorRepository.getPresignedUrl(file.name , file.type);

    // Step 2: Upload file directly to S3
    await fetch(presigned.url,{
        method:"PUT",
        body:file,
        headers:{
            "Content-Type" : file.type,
        }
    });

    // Step 3: Return final S3 object URL (your backend should construct)
    return presigned.url.split("?")[0]; // strip query params
}


export const tutorService = {

    async apply(formData : any){
        // upload profile image
        const profieImageUrl = formData.profieImage ? await uploadFileToS3(formData.profieImage) : null;

        // upload certificates
        const certificatesUrls: string[] = [];
        if(formData.certificates.length){
            for(const file of formData.certificates){
                const url = await uploadFileToS3(file);
                certificatesUrls.push(url);
            }
        }

        // build final payload
        const payload: TutorApplication = {
            ...formData,
            profileImage : profieImageUrl,
            certificates : certificatesUrls, 
        }

        return tutorRepository.applyForTutor(payload);
    }
}