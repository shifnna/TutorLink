import { ParsedQs } from "qs";
import { ITutor } from "../../models/tutor.js";
import { ApplyTutorRequestDTO, TutorResponseDTO } from "../../dtos/tutor.dto.js";

export interface ITutorService {

  applyForTutor(
    userId: string,
    dto: ApplyTutorRequestDTO
  ): Promise<ITutor>;

  getTutorProfile(
    userId: string
  ): Promise<ITutor | null>;

  getAllTutors(
    currentTutorId?: string,
    query?: ParsedQs
  ): Promise<TutorResponseDTO[]>;

  getTutorById(
    tutorId: string
  ): Promise<ITutor | null>;
}