import { NextFunction, Response } from "express";
import { successResponse } from "./commonResponse";


export const handleAsync = <T>(controllerFn: () => Promise<T>) =>
  async (res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await controllerFn();
      if (!res.headersSent) {
        res.status(200).json(successResponse(data));
      }
    } catch (err) {
      next(err);
    }
  };
