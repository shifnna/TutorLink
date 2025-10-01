import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";

export class BaseRepository <T extends Document> {
    protected model:Model<T>
    constructor(model:Model<T>){
        this.model = model;
    }

    async create(data:Partial<T>):Promise<T>{
        const doc = new this.model(data);
        return await doc.save();
    }

    async findOne(data:{email:string}): Promise<T | null>{
        const email = data.email;
        return this.model.findOne({email});
    }

    async findByIdAndUpdate(id: string, update: UpdateQuery<T>, options = { new: true }): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async findById(id:string): Promise<T | null>{
        return this.model.findById(id);
    }

    async findByEmail(email:string): Promise<T | null>{
        return this.model.findOne({email});
    }

    async findAll(filter: FilterQuery<T> ={}): Promise<T[]>{
        return this.model.find(filter);
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