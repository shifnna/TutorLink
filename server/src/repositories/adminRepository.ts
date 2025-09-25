import { inject } from "inversify";
import { ITutor, TutorModel } from "../models/tutor";
import { IUser, UserModel } from "../models/user";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { injectable } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @inject(TYPES.IUserModel) private readonly userModel: typeof UserModel,
    @inject(TYPES.ITutorModel) private readonly tutorModel: typeof TutorModel,
  ) {}
  
  async markApproved(userId:string): Promise<ITutor | null> {
    return await this.tutorModel.findOneAndUpdate({ tutorId: userId },{adminApproved:true});
  }

  async findById(userId:string):Promise<ITutor | null> {
    return await this.tutorModel.findOne({tutorId:userId});
  }

  async updateRole(userId:string): Promise<IUser | null> {
    return await this.userModel.findByIdAndUpdate(userId,{role:"tutor"});
  }
  
  async findPendingTutors(): Promise<ITutor[]>{
    return this.tutorModel.find({ adminApproved: false }).populate("tutorId", "name email").sort({ createdAt: -1 });
  }  
  
}
