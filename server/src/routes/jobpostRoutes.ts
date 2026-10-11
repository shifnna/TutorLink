import { Router } from "express";
import { JobPostController } from "../controllers/jobpostController.js";
import container from "../container/inversify.config.js";
import { TYPES } from "../types/types.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();
const c = container.get<JobPostController>(TYPES.IJobpostController);

router.use(protect);

router.get("/mine", c.mine); // keep above "/:id" routes
router.get("/", c.board);
router.post("/", c.create);
router.patch("/:id/close", c.close);
router.patch("/:id", c.update);
router.delete("/:id", c.remove);

export default router;