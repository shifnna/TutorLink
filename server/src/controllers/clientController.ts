import { inject, injectable } from "inversify";
import { IClientController } from "./interfaces/IClientController.js";
import { TYPES } from "../types/types.js";
import { Request, Response, NextFunction } from "express";
import { IClientRepository } from "../repositories/interfaces/IClientRepository.js";

@injectable()
export class clientController implements IClientController {
   constructor(
    @inject(TYPES.IClientRepository)
    private readonly _clientRepository: IClientRepository,
   ){}

    getSubjects = async (req:Request,res:Response,next:NextFunction) =>{
       try {
        const subjects = await this._clientRepository.getSubjects();
        return res.status(200).json({success: true, message: "Subjects fetched successfully", data: subjects})
       } catch (error) {
        next(error);
       }
    }
}