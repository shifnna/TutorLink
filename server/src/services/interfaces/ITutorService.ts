import { ApplyTutorRequestDTO, PresignedUrlRequestDTO } from "../../dtos/tutor.dto";
import { ITutor } from "../../models/tutor";

export interface ITutorService {
    applyForTutor(tutorId: string, body: ApplyTutorRequestDTO) : Promise<ITutor | null>;
    getAllTutors(currentTutorId?: string): Promise<ITutor[]>;
    getTutorById(tutorId: string): Promise<ITutor | null>;
    getTutorProfile(userId: string): Promise<ITutor | null>;
}