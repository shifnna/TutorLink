import { IUser } from "../../models/user";
import { ITutor } from "../../models/tutor";
import { ISession } from "../../models/session";

export interface IAdminRepository {
  getAllSession(): Promise<ISession[]>;
  findPendingTutors(): Promise<ITutor[]>;
  
}
