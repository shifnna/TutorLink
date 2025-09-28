import { inject } from "inversify";
import { ITutor, TutorModel } from "../models/tutor";
import { IUser, UserModel } from "../models/user";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { injectable } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.ITutorModel) private readonly _tutorModel: typeof TutorModel) {}
  
  async findPendingTutors(): Promise<ITutor[]>{
    return this._tutorModel.find({ adminApproved: false }).populate("tutorId", "name email").sort({ createdAt: -1 });
  }  
  
}
