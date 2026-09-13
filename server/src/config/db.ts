import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
  console.error(error instanceof Error ? `mongodb connection error ${error.message}` : error);
    process.exit(1);
  }
};

export default connectDB;
