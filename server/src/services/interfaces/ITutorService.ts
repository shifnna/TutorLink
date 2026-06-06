import { ParsedQs } from "qs";
import { ITutor } from "../../models/tutor";
import { ApplyTutorRequestDTO } from "../../dtos/tutor.dto";

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
  ): Promise<ITutor[]>;

  getTutorById(
    tutorId: string
  ): Promise<ITutor | null>;
}