import { ITutor } from "../../models/tutor";

export interface ITutorService {
    getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }>;
    applyForTutor(tutorId: string, body: any) : Promise<ITutor | null>,

}