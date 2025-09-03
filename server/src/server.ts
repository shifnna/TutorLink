import "reflect-metadata";
import connectDB from "./config/db";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
