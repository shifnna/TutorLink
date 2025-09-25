// This is where you wire everything together.
import { Container } from "inversify";
import { TYPES } from "../types/types";

import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { clientRepository } from "../repositories/clientRepository";

import { IAuthController } from "../controllers/interfaces/IAuthController";
import { AuthController } from "../controllers/authController";

import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthService } from "../services/authServices";

import { UserModel } from "../models/user";

import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { TutorRepository } from "../repositories/tutorRepository";

import { ITutorService } from "../services/interfaces/ITutorService";
import { TutorService } from "../services/tutorService";

import { ITutorController } from "../controllers/interfaces/ITutorController";
import { TutorController } from "../controllers/tutorController";

import { IAdminController } from "../controllers/interfaces/IAdminController";
import { AdminController } from "../controllers/adminController";
import { IAdminService } from "../services/interfaces/IAdminService";

import { S3Service } from "../services/s3Service";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { AdminRepository } from "../repositories/adminRepository";
import { TutorModel } from "../models/tutor";
import { AdminService } from "../services/adminService";

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

container.bind<S3Service>(TYPES.IS3Service).to(S3Service)

export default container;