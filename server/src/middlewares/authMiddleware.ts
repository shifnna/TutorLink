import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { COMMON_ERROR, STATUS_CODES } from "../utils/constants";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: COMMON_ERROR.USER_NOT_FOUND });

    req.user = user;
    next();
  } catch (error) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Not authorized, token failed" });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Admins only" });
  }
  next();
};
