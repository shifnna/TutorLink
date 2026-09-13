// This is where we wire everything together.
import { Container } from "inversify";
import { TYPES } from "../types/types";

import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { clientRepository } from "../repositories/clientRepository";

import { IAuthController } from "../controllers/interfaces/IAuthController";
import { AuthController } from "../controllers/authController";

import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthService } from "../services/authServices";

import { UserModel } from "../models/user.js";

import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { TutorRepository } from "../repositories/tutorRepository";

import { ITutorService } from "../services/interfaces/ITutorService.js";
import { TutorService } from "../services/tutorService.js";

import { ITutorController } from "../controllers/interfaces/ITutorController.js";
import { TutorController } from "../controllers/tutorController.js";

import { IAdminController } from "../controllers/interfaces/IAdminController.js";
import { AdminController } from "../controllers/adminController.js";
import { IAdminService } from "../services/interfaces/IAdminService.js";

import { IAdminRepository } from "../repositories/interfaces/IAdminRepository.js";
import { AdminRepository } from "../repositories/adminRepository.js";
import { TutorModel } from "../models/tutor.js";
import { AdminService } from "../services/adminService.js";

import { ISlotController } from "../controllers/interfaces/ISlotController.js";
import { SlotController } from "../controllers/slotController.js";
import { ISlotService } from "../services/interfaces/ISlotService.js";
import { SlotService } from "../services/slotService.js";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository.js";
import { SlotRepository } from "../repositories/slotRepository.js";
import { ISessionController } from "../controllers/interfaces/ISessionController.js";
import { SessionController } from "../controllers/sessionController.js";
import { ISessionService } from "../services/interfaces/ISessionService.js";
import { SessionService } from "../services/SessionService.js";
import { ISessionRepository } from "../repositories/interfaces/ISessionRepository.js";
import { SessionRepository } from "../repositories/SessionRepository.js";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import { INotificationService } from "../services/interfaces/INotificationService.js";
import { INotificationController } from "../controllers/interfaces/INotificationController.js";
import { NotificationRepository } from "../repositories/notificationRepository.js";
import { NotificationService } from "../services/notificationService.js";
import { NotificationController } from "../controllers/notificationController.js";

const container = new Container();

container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

container.bind<IClientRepository>(TYPES.IClientRepository).to(clientRepository);

container.bind<ITutorRepository>(TYPES.ITutorRepository).to(TutorRepository);
container.bind<ITutorService>(TYPES.ITutorService).to(TutorService);
container.bind<ITutorController>(TYPES.ITutorController).to(TutorController)
container.bind<typeof TutorModel>(TYPES.ITutorModel).toConstantValue(TutorModel);

container.bind<IAdminController>(TYPES.IAdminController).to(AdminController);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService);

container.bind<typeof UserModel>(TYPES.IUserModel).toConstantValue(UserModel);

container.bind<ISlotController>(TYPES.ISlotController).to(SlotController);
container.bind<ISlotService>(TYPES.ISlotService).to(SlotService)
container.bind<ISlotRepository>(TYPES.ISlotRepository).to(SlotRepository);

container.bind<ISessionController>(TYPES.ISessionController).to(SessionController);
container.bind<ISessionService>(TYPES.ISessionService).to(SessionService);
container.bind<ISessionRepository>(TYPES.ISessionRepository).to(SessionRepository);

container.bind<INotificationRepository>(TYPES.INotificationRepository).to(NotificationRepository);
container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService);
container.bind<INotificationController>(TYPES.INotificationController).to(NotificationController);

export default container;