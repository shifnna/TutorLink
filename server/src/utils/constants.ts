export enum COMMON_ERROR {
  MISSING_FIELDS = "All fields are required",
  INVALID_NAME = "Name must be at least 3 characters",
  INVALID_EMAIL = "Invalid email format",
  WEAK_PASSWORD = "Password must be at least 6 characters",
  EMAIL_IN_USE = "Email already in use",
  PASSWORDS_MISMATCH = "Passwords are not matching",
  INVALID_CREDENTIALS = "Invalid credentials",
  USER_NOT_FOUND = "User Not Found",
  ALREADY_VERIFIED = "User Alredy Verified",
  USER_BLOCKED = "Your account has been blocked by admin"
}

export enum COMMON_SUCCESS {
  REGISTERED = "User registered successfully",
}


export enum ALERT_MESSAGES {
  CONNECT_TUTOR= "Do you really want to connect with this tutor?",
  VIEW_TUTOR= "Do you want to view this tutor's details?",
};


export enum STATUS_CODES{
  SUCCESS= 200,
  CREATED= 201,
  BAD_REQUEST= 400,
  UNAUTHORIZED= 401,
  NOT_FOUND= 404,
  SERVER_ERROR= 500,
  FORBIDDEN= 403
};