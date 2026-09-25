import { ITutor } from "../../models/tutor.js";
import { ISession } from "../../models/session.js";

export interface IAdminRepository {
  getAllSession(): Promise<ISession[]>;
  findPendingTutors(): Promise<ITutor[]>;
  
}


export interface PopulatedTutorUser {
  name: string;
  email: string;
  tutorApplication?: {
    status?: string;
  };
}

export type PopulatedTutor = Omit<ITutor, "tutorId"> & {
  tutorId?: PopulatedTutorUser;
};
