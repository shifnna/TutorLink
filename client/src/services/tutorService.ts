import { tutorRepository } from "../repositories/tutorRepository";
import { ITutorApplication } from "../types/ITutorApplication";


async function uploadFileToS3(file: File): Promise<string> {
  try {
    const safeFileName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const { url, key } = await tutorRepository.getPresignedUrl(safeFileName, file.type);
    // Upload file to S3
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
  
    return key;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
}



export const tutorService = {

    async apply(formData : any){
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

        return tutorRepository.applyForTutor(payload);
    }
}