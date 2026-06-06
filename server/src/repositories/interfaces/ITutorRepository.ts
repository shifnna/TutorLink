import { TutorResponseDTO } from "../../dtos/tutor.dto";
import { ITutor } from "../../models/tutor";
import { ParsedQs } from "qs";


export interface ITutorRepository{
  create(data:Partial<ITutor>) : Promise<ITutor>;
  findAllApproved(
    excludeTutorId?: string,
    query?: ParsedQs
  ): Promise<TutorResponseDTO[]>;
  findById(userId: string): Promise<ITutor | null>;
  findOne(data:{tutorId:string}): Promise<ITutor | null>
  findOneAndUpdate(filter: Partial<ITutor>,updateData: Partial<ITutor>): Promise<ITutor | null>;
}