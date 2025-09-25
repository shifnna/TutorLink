import { IUser, UserModel } from "../models/user";
import { IClientRepository } from "./interfaces/IClientRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";

@injectable()
export class clientRepository implements IClientRepository {
    constructor(@inject(TYPES.IUserModel) private readonly userModel: typeof UserModel) {}

    async findClients(): Promise<IUser[]> {
        return this.userModel.find({ role: "client" });
    }

    async findTutorsWithProfile(): Promise<IUser[]> {
        return this.userModel.find({ role: "tutor" }).populate("tutorProfile");
    }

    async countUsers(): Promise<number> {
        return this.userModel.countDocuments({ role: { $ne: "admin" } });
    }

    async countTutors(): Promise<number> {
        return this.userModel.countDocuments({ role: "tutor" });
    }

    async create(user: object): Promise<IUser> {
        return await this.userModel.create(user);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.userModel.findOne({ email });
    }

    async updateStatus(id: string, isBlocked: true | false): Promise<IUser | null> {
        return this.userModel.findByIdAndUpdate(id, { isBlocked }, { new: true });
    }

    async findById(id: string): Promise<IUser | null> {
        return this.userModel.findById(id);
    }

}
