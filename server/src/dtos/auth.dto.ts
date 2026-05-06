export interface SignupRequestDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface VerifyOtpRequestDTO {
  email: string;
  otp: string;
  type: "signup" | "forgot";
}

export interface ResendOtpRequestDTO {
  email: string;
  type: "signup" | "forgot";
}

export interface ResetPasswordRequestDTO {
  email: string;
  password: string;
}
