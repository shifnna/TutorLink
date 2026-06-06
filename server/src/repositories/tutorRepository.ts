import { inject, injectable } from "inversify";
import { FilterQuery } from "mongoose";
import { ParsedQs } from "qs";

import { TutorModel, ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";
import { TYPES } from "../types/types";
import { BaseRepository } from "./baseRepository";
import { string } from "zod";

@injectable()
export class TutorRepository
  extends BaseRepository<ITutor>
  implements ITutorRepository {

  constructor(
    @inject(TYPES.ITutorModel)
    tutorModel: typeof TutorModel
  ) {
    super(tutorModel);
  }

  async findAllApproved(
    excludeTutorId?: string,
    query?: ParsedQs
  ): Promise<ITutor[]> {

    const filter: FilterQuery<ITutor> = {
      adminApproved: true,
    };

    if (excludeTutorId) {
      filter.tutorId = {
        $ne: excludeTutorId,
      };
    }

    if (query?.experienceLevels) {

      filter.experienceLevel = {
        $in: String(query.experienceLevels)
          .split(","),
      };
    }

    if (query?.search) {

  const searchRegex = new RegExp(
    String(query.search),
    "i"
  );

  const tutors = await this.model
    .find(filter)
    .populate(
      "tutorId",
      "_id name email"
    );

  return tutors.filter((tutor) => {

    const tutorName =
      typeof tutor.tutorId === "object" &&
      tutor.tutorId !== null &&
      "name" in tutor.tutorId
        ? String((tutor.tutorId as { name?: unknown }).name)
        : "";

    const tutorOccupation =
      typeof tutor.occupation === "string"
        ? tutor.occupation
        : String(tutor.occupation ?? "");

    return (
      searchRegex.test(tutorName) ||
      searchRegex.test(tutorOccupation)
    );
  });
}

    let mongoQuery = this.model
      .find(filter)
      .populate(
        "tutorId",
        "_id name email"
      );

    switch (query?.sortBy) {

      case "name_asc":
        mongoQuery =
          mongoQuery.sort({
            createdAt: 1,
          });
        break;

      case "name_desc":
        mongoQuery =
          mongoQuery.sort({
            createdAt: -1,
          });
        break;

      default:
        mongoQuery =
          mongoQuery.sort({
            createdAt: -1,
          });
    }

    return await mongoQuery.exec();
  }

  async findById(
    id: string
  ): Promise<ITutor | null> {

    return this.model
      .findById(id)
      .populate(
        "tutorId",
        "name email profileImage"
      );
  }
}