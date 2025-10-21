import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import cookieParser from "cookie-parser";
import tutorRoutes from "./routes/tutorRoutes";
import session from "express-session";
import passport from "passport";
import "./config/passport"; ////ensures the Google strategy is registered before you call passport.authenticate("google").
import { consoleLogger, fileLogger } from "./middlewares/logger";

const app = express();
app.use(cookieParser());

//// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));


//// Debug logger during development
app.use(consoleLogger);

//// Save detailed logs to file
app.use(fileLogger);


////Enable sessions (required by Passport):
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


//// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes)

export default app;

