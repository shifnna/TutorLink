import { inject } from "inversify";
import { ITutor, TutorModel } from "../models/tutor";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { injectable } from "inversify";
import { TYPES } from "../types/types";
import { ISession, SessionModel } from "../models/session";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.ITutorModel) private readonly _tutorModel: typeof TutorModel) {}
  
  async findPendingTutors(): Promise<ITutor[]>{
    return this._tutorModel.find({ adminApproved: false }).populate("tutorId", "name email tutorApplication").sort({ createdAt: -1 });
  }  

  async getAllSession(): Promise<ISession[]>{
    let sessions = await SessionModel.find()
      .populate({
        path: "tutorId",
        populate: { path: "tutorId", select: "name email" }  
      })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return sessions;
  }
  
}
