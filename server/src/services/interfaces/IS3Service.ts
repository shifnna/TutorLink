export interface IS3Service {
    getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }>;
    uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
}