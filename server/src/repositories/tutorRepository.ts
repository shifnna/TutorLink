import { inject, injectable } from "inversify";
import { FilterQuery } from "mongoose";
import { ParsedQs } from "qs";
import { TutorModel, ITutor } from "../models/tutor.js";
import { ITutorRepository } from "./interfaces/ITutorRepository.js";
import { TYPES } from "../types/types.js";
import { BaseRepository } from "./baseRepository.js";

@injectable()
export class TutorRepository
  extends BaseRepository<ITutor>
  implements ITutorRepository {

  constructor(@inject(TYPES.ITutorModel) tutorModel: typeof TutorModel ) { 
    super(tutorModel);
  }

  async findAllApproved( excludeTutorId?: string, query?: ParsedQs ): Promise<ITutor[]> {

    const filter: FilterQuery<ITutor> = { 
      adminApproved: true 
    };

    if (excludeTutorId) {
        filter.tutorId = { $ne: excludeTutorId };
    }

    if (query?.experienceLevels) {
      filter.experienceLevel = { 
        $in: String(query.experienceLevels).split(","),
      };
    }

    if (query?.subjects) {
      filter.subjects = {
        $in: String(query.subjects).toLowerCase().split(","),
      };
    }

    if (query?.languages) {
      filter.languages = {
        $in: String(query.languages).toLowerCase().split(","),
      };
    }

    if (query?.search) { 
      const searchRegex = new RegExp( String(query.search), "i" );
      const tutors = await this.model.find(filter).populate( "tutorId", "_id name email" );

  return tutors.filter((tutor) => {
    const tutorName =
      typeof tutor.tutorId === "object" &&
      tutor.tutorId !== null &&
      "name" in tutor.tutorId
        ? String((tutor.tutorId as { name?: unknown }).name) : "";

    const tutorOccupation = typeof tutor.occupation === "string" ? tutor.occupation : String(tutor.occupation ?? "");

    return ( searchRegex.test(tutorName) || searchRegex.test(tutorOccupation) );
  });
}

    let mongoQuery = this.model.find(filter).populate( "tutorId", "_id name email").lean();

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

  async findById( id: string ): Promise<ITutor | null> {
    return this.model.findById(id).populate( "tutorId", "name email profileImage");
  }

  // Real counts straight from the collection — no hardcoded list.
  async getTopSubjects(limit = 8): Promise<{ subject: string; count: number }[]> {
    return this.model.aggregate([
      { $match: { adminApproved: true } },
      { $unwind: "$subjects" },
      { $group: { _id: "$subjects", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, subject: "$_id", count: 1 } },
    ]);
  }

   // Real, deduped, sorted values straight from approved tutor profiles —
  // no hardcoded lists. Powers the sidebar's checkbox options.
  async getFilterOptions(): Promise<{
    subjects: string[];
    languages: string[];
    experienceLevels: string[];
  }> {
    const [subjects, languages, experienceLevels] = await Promise.all([
      this.model.distinct("subjects", { adminApproved: true }),
      this.model.distinct("languages", { adminApproved: true }),
      this.model.distinct("experienceLevel", { adminApproved: true }),
    ]);

    return {
      subjects: (subjects as string[]).filter(Boolean).sort(),
      languages: (languages as string[]).filter(Boolean).sort(),
      experienceLevels: (experienceLevels as string[]).filter(Boolean).sort(),
    };
  }

}