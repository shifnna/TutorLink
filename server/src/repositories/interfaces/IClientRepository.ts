import { IUser } from "../../models/user";

export interface IClientRepository {
    findClients(): Promise<IUser[]>;
    findTutorsWithProfile(): Promise<IUser[]>;
    countUsers(): Promise<number>;
    countTutors(): Promise<number>;
    create(user: object): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    updateStatus(id: string, isBlocked: true | false): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
}
