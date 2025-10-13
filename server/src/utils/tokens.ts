import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
};