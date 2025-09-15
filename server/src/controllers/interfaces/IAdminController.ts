import { Request,Response } from "express"

export interface IAdminController{
    getAllUsers(req: Request, res: Response): Promise<void>;
    toggleUserStatus(req: Request, res: Response) : Promise<Response>;
}