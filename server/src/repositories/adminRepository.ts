import { inject } from "inversify";
import { ITutor, TutorModel } from "../models/tutor.js";
import { IAdminRepository } from "./interfaces/IAdminRepository.js";
import { injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { ISession, SessionModel } from "../models/session.js";

interface PopulatedTutorUser {
  name: string;
  email: string;
  tutorApplication?: {
    status?: string;
  };
}

type PopulatedTutor = Omit<ITutor, "tutorId"> & {
  tutorId?: PopulatedTutorUser;
};

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.ITutorModel) private readonly _tutorModel: typeof TutorModel) {}

  async findPendingTutors(): Promise<ITutor[]> {
    const tutors = await this._tutorModel
      .find({ adminApproved: false })
      .populate("tutorId", "name email tutorApplication")
      .sort({ createdAt: -1 });

    return (tutors as unknown as PopulatedTutor[]).filter(
      (tutor) => tutor.tutorId?.tutorApplication?.status === "Pending"
    ) as unknown as ITutor[];
  }

  async getAllSession(): Promise<ISession[]> {
    return await SessionModel.find()
      .populate("tutorId", "name email")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
  }
}