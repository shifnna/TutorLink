import axios from "axios";

// Provide ImportMeta.env typings for Vite env vars
declare global {
  interface ImportMetaEnv {
    readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
    readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export async function uploadToCloudinary(
  file: File
): Promise<string> {
  try {
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log("Cloud:", cloudName);
    console.log("Preset:", uploadPreset);

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary env variables missing");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    console.log("UPLOAD SUCCESS:", response.data);

    if (!response.data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return response.data.secure_url;
  } catch (err: any) {
    console.error(
      "FULL CLOUDINARY ERROR:",
      err?.response?.data || err
    );

    throw err;
  }
}