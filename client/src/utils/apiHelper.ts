import axios, { AxiosError } from "axios";

export interface ICommonResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Array<{ field?: string; message: string }>;
  statusCode?: number;
}


export const handleApi = async <T>(apiCall: Promise<{ data: ICommonResponse<T> }>): Promise<ICommonResponse<T>> => {
  try {
    const response = await apiCall;

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      errors: response.data.errors,
      statusCode: response.data.statusCode,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ICommonResponse<T>>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Request failed",
        data: null,
        errors: axiosError.response?.data?.errors,
        statusCode: axiosError.response?.status,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
      statusCode: 500,
    };
  }
};
