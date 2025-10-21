import { Request,Response } from "express"

export interface IAdminController{
    getAllClients : (req: Request, res: Response) => void;
    getAllTutors : (req: Request, res: Response) => void;
    getAllTutorApplications : (req: Request, res: Response) => void;
    toggleUserStatus : (req: Request, res: Response) => void;
    approveTutor : (req: Request, res: Response) => void;
    rejectTutor : (req: Request, res: Response) => void;
    getDashboardStats : (req: Request, res: Response) => void;
}