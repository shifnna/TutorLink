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

    async findClientsPaginated(
  filter: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<{ users: IUser[]; total: number }> {
  const [users, total] = await Promise.all([
    UserModel.find(filter).sort(sort).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
  ]);

  return { users: users as IUser[], total };
}
}
