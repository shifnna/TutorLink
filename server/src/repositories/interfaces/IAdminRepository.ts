import { IUser } from "../../models/user";
import { ITutor } from "../../models/tutor";

export interface IAdminRepository {
  // markApproved(userId: string): Promise<ITutor | null>;
  findPendingTutors(): Promise<ITutor[]>;
}
