// Repo-Contract (implimentation) --- Actual code that talks to the DB
import { IUser, UserModel } from "../models/user";
import { TutorModel } from "../models/tutor";
import { IClientRepository } from "./interfaces/IClientRepository";
import { injectable,inject } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class clientRepository implements  IClientRepository {
    constructor(@inject(TYPES.IUserModel) private readonly userModel: typeof UserModel) {}

    async create(user: object): Promise<IUser> {
        return await this.userModel.create(user);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.userModel.findOne({email})
    }

    async findById(id: string): Promise<IUser | null> {
        return this.userModel.findById(id);
    }

    async updateStatus(id: string, isBlocked: true | false): Promise<IUser | null> {
    return this.userModel.findByIdAndUpdate(id, { isBlocked }, { new: true });
    }

    async updateRole(userId: string): Promise<IUser | null> {
     return this.userModel.findByIdAndUpdate(userId,{role:"tutor"},{ new: true });
    }

    async delete(userId:string): Promise<void> {
        await TutorModel.findOneAndDelete({tutorId:userId});
        return;
    }
}