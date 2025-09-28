import { IUser, UserModel } from "../models/user";
import { IClientRepository } from "./interfaces/IClientRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { BaseRepository } from "./baseRepository";

@injectable()
export class clientRepository extends BaseRepository<IUser> implements IClientRepository {
    constructor(@inject(TYPES.IUserModel) userModel: typeof UserModel) {
        super(userModel);
    }

    async findTutorsWithProfile(): Promise<IUser[]> {
        return this.model.find({ role: "tutor" }).populate("tutorProfile");
    }
}
