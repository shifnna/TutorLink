import { ITutor } from "../../models/tutor";

export interface ITutorRepository{
  create(data:Partial<ITutor>) : Promise<ITutor>;
  findAllApproved(): Promise<ITutor[]>;
  findById(userId: string): Promise<ITutor | null>;
  findOne(data:{tutorId:string}): Promise<ITutor | null>
  findOneAndUpdate(filter: Partial<ITutor>,updateData: Partial<ITutor>): Promise<ITutor | null>;
}