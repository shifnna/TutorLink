import { NextFunction, Request,Response } from "express"

export interface IAdminController{
    getAllClients : (req: Request, res: Response, next: NextFunction) => void;
    getAllTutors : (req: Request, res: Response, next: NextFunction) => void;
    getAllTutorApplications : (req: Request, res: Response, next: NextFunction) => void;
    toggleUserStatus : (req: Request, res: Response, next: NextFunction) => void;
    approveTutor : (req: Request, res: Response, next: NextFunction) => void;
    rejectTutor : (req: Request, res: Response, next: NextFunction) => void;
    getDashboardStats : (req: Request, res: Response, next: NextFunction) => void;
}