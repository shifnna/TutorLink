import { ITutor } from "../../models/tutor";

export interface ITutorRepository{
    create(tutor: Partial<ITutor>): Promise<ITutor>;
    findById(id: string): Promise<ITutor | null>;
    findByTutorId(tutorId: string): Promise<ITutor | null>;
}