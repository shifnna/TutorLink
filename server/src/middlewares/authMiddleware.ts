import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { COMMON_ERROR, STATUS_CODES } from "../utils/constants";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No access token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: COMMON_ERROR.USER_NOT_FOUND });

    if(user.isBlocked) return res.status(STATUS_CODES.FORBIDDEN).json({message: COMMON_ERROR.USER_BLOCKED });
    
    req.user = user;
    next();
  } catch (error: any) {
    console.error("JWT Verify failed:", error.message);
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Access token invalid or expired" });
  }

};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Admins only" });
  }
  next();
};
