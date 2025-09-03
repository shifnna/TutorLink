import { IUser,UserModel } from "../models/user";

export interface IUserRepository{
    create(user:IUser) : Promise<IUser>;
    findByEmail(email:string) : Promise<IUser | null>;
}

export class UserRepository implements  IUserRepository {
    async create(user: IUser): Promise<IUser> {
        return await UserModel.create(user);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email})
    }

    async findById(id: string): Promise<IUser | null> {
        return UserModel.findById(id);
    }

}