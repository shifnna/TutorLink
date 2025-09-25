import { tutorService } from "../services/tutorService";

export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const safeFileName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const { url, key } = await tutorService.getPresignedUrl(safeFileName, file.type);
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
