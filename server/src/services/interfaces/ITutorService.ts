import { ApplyTutorRequestDTO } from "../../dtos/tutor/TutorRequestDTO";
import { ITutor } from "../../models/tutor";

export interface ITutorService {
    getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }>;
    applyForTutor(tutorId: string, body: ApplyTutorRequestDTO) : Promise<ITutor | null>;
    getAllTutors(currentTutorId?: string): Promise<ITutor[]>;
    getTutorProfile(userId: string): Promise<ITutor | null>;
}