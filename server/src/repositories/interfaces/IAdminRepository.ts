import { IUser } from "../../models/user";
import { ITutor } from "../../models/tutor";

export interface IAdminRepository {
  markApproved(userId: string): Promise<ITutor | null>;
  findById(userId: string): Promise<ITutor | null>;
  updateRole(userId: string): Promise<IUser | null>;
  findPendingTutors(): Promise<ITutor[]>;
}
