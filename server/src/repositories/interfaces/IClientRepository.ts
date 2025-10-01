import { FilterQuery } from "mongoose";
import { IUser } from "../../models/user";

export interface IClientRepository {
    findAll(filter?: FilterQuery<IUser >): Promise<IUser[]>;
    findTutorsWithProfile(): Promise<IUser[]>;
    count(filter?: FilterQuery<IUser >): Promise<number>;
    create(user: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    findByIdAndUpdate(id: string, update: Partial<IUser>): Promise<IUser | null>;
}
