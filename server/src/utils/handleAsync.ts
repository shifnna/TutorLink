import { NextFunction, Response } from "express";

/**
 * Handles async controller logic and sends standardized response
 * @param res Express Response object
 * @param controllerFn The async function that returns the data
 * @param successMessage Optional success message
 */

export const handleAsync = <T>(controllerFn: () => Promise<T>) =>
  async (res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await controllerFn();
      if (!res.headersSent)
        res.status(200).json(data);
    } catch (err) {
      next(err)
    }
  };

