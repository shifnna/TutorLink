import { Request, Response } from "express";

export interface ITutorController{
    applyForTutor(req: Request, res: Response): Promise<void>
}