import { tutorService } from "../services/tutorService";
import { IS3UploadResponse } from "../types/ITutorApplication";

export async function uploadFileToS3(file: File): Promise<string> {
  try {
    const safeFileName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-\.]/g, "");

    const presignedResponse = await tutorService.getPresignedUrl(
      safeFileName,
      file.type
    );

    const presignedData: IS3UploadResponse | null = presignedResponse.data ?? null;

    const uploadInfo = presignedData?.data;
    if (!uploadInfo?.url || !uploadInfo?.key) {
      throw new Error(
        "Invalid presigned structure: " + JSON.stringify(presignedResponse)
      );
    }

    const { url, key } = uploadInfo;

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("S3 Upload failed:", errorText);
      throw new Error(`Failed to upload file to S3. Status: ${uploadResponse.status}`);
    }
    return key;
  } catch (err) {
    console.error("uploadFileToS3 error:", err);
    throw err;
  }
}
