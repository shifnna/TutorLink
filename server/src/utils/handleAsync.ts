import { Response } from "express";
import { STATUS_CODES } from "../utils/constants";

/**
 * Handles async controller logic and sends standardized response
 * @param res Express Response object
 * @param controllerFn The async function that returns the data
 * @param successMessage Optional success message
 */

export const handleAsync = <T>(controllerFn: () => Promise<T>) =>
  async (res: Response): Promise<void> => {
    try {
      const data = await controllerFn();
      if (!res.headersSent) {
        res.status(STATUS_CODES.SUCCESS).json(data);
      }
      
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error('Error in handleAsync:', err);
      res.status(STATUS_CODES.SERVER_ERROR).json(errorMessage);
    }
  };
