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

const container = new Container();

container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

container.bind<IClientRepository>(TYPES.IClientRepository).to(clientRepository);

container.bind<ITutorRepository>(TYPES.ITutorRepository).to(TutorRepository);
container.bind<ITutorService>(TYPES.ITutorService).to(TutorService);

container.bind<typeof UserModel>(TYPES.IUserModel).toConstantValue(UserModel);

export default container;