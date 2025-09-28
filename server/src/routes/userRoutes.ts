import { Router } from "express";
import container from "../container/inversify.config";
import { TYPES } from "../types/types";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";

const router = Router();
const controller = container.get<IClientRepository>(TYPES.IClientRepository);


export default router;