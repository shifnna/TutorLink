import { NextFunction, Request, Response } from "express";

export interface ITutorController{
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
    applyForTutor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTutors(req: Request, res: Response, next: NextFunction): Promise<void>;
}