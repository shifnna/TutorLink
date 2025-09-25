import { ITutor } from "../../models/tutor";

export interface ITutorRepository {
  createApplication(data: Partial<ITutor>): Promise<ITutor>;
  findAllApproved(): Promise<ITutor[]>;
}
