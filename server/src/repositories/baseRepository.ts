import { Document, FilterQuery, Model, QueryOptions, SortOrder, UpdateQuery } from "mongoose";

export class BaseRepository <T extends Document> {
    protected model:Model<T>
    constructor(model:Model<T>){
        this.model = model;
    }

    async create(data:Partial<T>):Promise<T>{
        const doc = new this.model(data);
        return await doc.save();
    }

    async createMany(data: Partial<T>[]): Promise<T[]> {
      const docs = await this.model.insertMany(data);
      return docs as unknown as T[];
    }

    async findOne(filter:FilterQuery<T>): Promise<T | null>{
        return this.model.findOne(filter);
    }

    async findByIdAndUpdate(id: string, update: UpdateQuery<T>, options = { new: true }): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async findByIdAndDelete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async deleteMany(filter: FilterQuery<T>): Promise<void> {
        await this.model.deleteMany(filter);
    }

    async findById(id:string): Promise<T | null>{
        return this.model.findById(id);
    }

    async findByEmail(email:string): Promise<T | null>{
        return this.model.findOne({email});
    }

    async findAll(filter: FilterQuery<T>,sort?: Record<string, SortOrder>,options?: QueryOptions): Promise<T[]>{
        const query = this.model.find(filter, null, options);
        if (sort) query.sort(sort);
        return query.exec();
    }

    async count(filter: FilterQuery<T> = {}): Promise<number>{
        return this.model.countDocuments(filter);
    }

    async findOneAndUpdate(filter: FilterQuery<T>, updateData: UpdateQuery<T>, options = { new: true }): Promise<T | null> {
       return this.model.findOneAndUpdate(filter, updateData, options);
    }

    async updateById(id: string, updateData: Partial<T>, options = { new: true }): Promise<T | null> {
       return this.model.findByIdAndUpdate(id, updateData, options);
    }

}