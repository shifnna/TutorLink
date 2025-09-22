import { Request, Response } from "express";

export interface ITutorController{
    getPresignedUrl(req: Request, res: Response): Promise<void>;
    applyForTutor(req: Request, res: Response): Promise<void>
}