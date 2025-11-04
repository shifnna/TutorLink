import axios, { AxiosError } from "axios";

export interface ICommonResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Array<{ field: string; message: string }>;
}

export const handleApi = async <T>(apiCall: Promise<{ data: T }>): Promise<ICommonResponse<T>> => {
  try {
    const response = await apiCall;
    return {
      success: true,
      message: "Success",
      data: response.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Array<{ field: string; message: string }>;
      }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Request failed",
        data: null,
        errors: axiosError.response?.data?.errors,
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
};

