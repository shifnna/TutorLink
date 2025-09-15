import { ITutor } from "../../models/tutor";

export interface ITutorService {
    applyTutor(tutorId: string,data: any,files: { profileImage?: Express.Multer.File; certificates?: Express.Multer.File[] }) : Promise<ITutor | null>,

}