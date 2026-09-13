import { ITutor } from "../../models/tutor.js";
import { ISession } from "../../models/session.js";

export interface IAdminRepository {
  getAllSession(): Promise<ISession[]>;
  findPendingTutors(): Promise<ITutor[]>;
  
}
