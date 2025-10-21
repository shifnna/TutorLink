import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../models/user";
import { COMMON_ERROR, STATUS_CODES } from "../utils/constants";
import { generateAccessToken } from "../utils/tokens";

export interface AuthRequest extends Request {
  user?: IUser ;
}


export const protect: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const authHeader = req.headers.authorization;
    const accessToken = req.cookies?.accessToken || authHeader?.split(" ")[1];

    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
      return res.status(401).json({ message: "No access token" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { id: string };
      const user = await UserModel.findById(decoded.id);
      if (!user) return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: COMMON_ERROR.USER_NOT_FOUND });
      if (user.isBlocked) return res.status(STATUS_CODES.FORBIDDEN).json({ message: COMMON_ERROR.USER_BLOCKED });

      authReq.user = user; 
      return next();

    } catch (err) {
      if (!refreshToken) return res.status(403).json({ message: "Token expired. Please login again." });

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string };
        const user = await UserModel.findById(decodedRefresh.id);
        if (!user) return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: COMMON_ERROR.USER_NOT_FOUND });
        if (user.isBlocked) return res.status(STATUS_CODES.FORBIDDEN).json({ message: COMMON_ERROR.USER_BLOCKED });

        const newAccessToken = generateAccessToken({ id: user.id, role: user.role })

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || "900000", 10),
        });

        authReq.user = user; 
        return next();
      } catch {
        return res.status(403).json({ message: "Refresh token invalid or expired. Please login again." });
      }
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error });
  }
};



export const adminOnly: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Admins only" });
  }
  next();
};
