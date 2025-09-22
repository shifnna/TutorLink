// Repo-Contract (interface) -- It defines what operations are possible
import { IUser } from "../../models/user";

export interface IClientRepository{
    create(user:IUser) : Promise<IUser>;
    findByEmail(email:string) : Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    updateStatus(id: string, isBlocked: true | false): Promise<IUser | null>;
    updateRole(userId: string): Promise<IUser | null>;
    delete(userId:string): Promise<void>;
}
