import { tutorService } from "../services/tutorService";

export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const safeFileName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const presignedResponse = await tutorService.getPresignedUrl(safeFileName, file.type);

if (!presignedResponse.success || !presignedResponse.data) {
  throw new Error(presignedResponse.message || "Failed to get presigned URL");
}

const { url, key } = presignedResponse.data;
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
