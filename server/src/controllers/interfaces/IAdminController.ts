import { Request,Response } from "express"

export interface IAdminController{
    getAllClients(req: Request, res: Response): Promise<void>;
    getAllTutors(req: Request, res: Response): Promise<void>;
    getAllTutorApplications(req: Request, res: Response): Promise<void>;
    toggleUserStatus(req: Request, res: Response) : Promise<Response>;
    approveTutor(req: Request, res: Response) : Promise<Response>;
    getDashboardStats(req: Request, res: Response): Promise<void>;
}