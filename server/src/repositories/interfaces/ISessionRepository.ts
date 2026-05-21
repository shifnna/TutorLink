import { ISession } from "../../models/session";

export interface ISessionRepository {
  createSession(session: Partial<ISession>):Promise<ISession>;
  findSessionById(id: string):Promise<ISession | null>;
  saveSession(session: ISession):Promise<ISession>;
  getSessionsForUser(userId: string):Promise<ISession[]>;
  findSessionsByUserId (tutorId:string): Promise<ISession[]>;
  findSessionsByTutorId (userId:string): Promise<ISession[]>;
  findById (sessionId:string): Promise<ISession | null>;
  updateAdminWallet(userId: string, amount: number, sessionId: string): Promise<void>;
}