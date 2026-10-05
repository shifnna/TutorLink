import { Router } from "express";
import container from "../container/inversify.config.js";
import { TYPES } from "../types/types.js";
import { IClientController } from "../controllers/interfaces/IClientController.js";

const router = Router();
const controller = container.get<IClientController>(TYPES.IClientController);

router.get("/getSubjects", controller.getSubjects);

export default router;