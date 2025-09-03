import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

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

export default app;
