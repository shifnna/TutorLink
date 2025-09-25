import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import cookieParser from "cookie-parser";
import tutorRoutes from "./routes/tutorRoutes";


const app = express();
app.use(cookieParser());

//// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//// Debug logger
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});

//// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes)

export default app;
