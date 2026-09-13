import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import tutorRoutes from "./routes/tutorRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; ////ensures the Google strategy is registered before you call passport.authenticate("google").
import { consoleLogger, fileLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

//// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));


//// Debug logger during development otherwise Save detailed logs to file
if(process.env.NODE_ENV === "production"){
  app.use(fileLogger);
}else{
  app.use(consoleLogger);
}


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
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/notifications", notificationRoutes);

////error handler for consistent JSON
app.use(errorHandler);


export default app;
