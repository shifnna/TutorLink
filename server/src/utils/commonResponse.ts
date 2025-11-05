export interface ICommonResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: Array<{ field?: string; message: string }>;
  statusCode?: number;
}



/**Success wrapper */
export const successResponse = <T>(
  data: T | null = null,
  message = "Success",
  statusCode = 200
): ICommonResponse<T> => ({
  success: true,
  message,
  data,
  statusCode,
});



/**Error wrapper */
export const errorResponse = (
  message = "Something went wrong",
  statusCode = 500,
  errors?: Array<{ field?: string; message: string }>
): ICommonResponse => ({
  success: false,
  message,
  data: null,
  errors,
  statusCode,
});
