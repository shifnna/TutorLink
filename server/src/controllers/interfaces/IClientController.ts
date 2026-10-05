import { NextFunction, Request, Response } from "express";

export interface IClientController {
   getSubjects: (req:Request, res:Response, next:NextFunction) => Promise<Response | void>;
}