import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Confing";
import { IS3Service } from "./interfaces/IS3Service";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service implements IS3Service {

  async getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }> {
    const sanitizedFileName = fileName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const key = `${uuidv4()}-${sanitizedFileName}`;


    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return { url, key };
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const key = `${uuidv4()}-${fileName}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
