export const MESSAGES = {
  COMMON: {
    ERROR: {
      MISSING_FIELDS: "All fields are required",
      INVALID_NAME: "Name must be at least 3 characters",
      INVALID_EMAIL: "Invalid email format",
      WEAK_PASSWORD: "Password must be at least 6 characters",
      EMAIL_IN_USE: "Email already in use",
      PASSWODS_MISSMATCH: "Passwordsare not mtching",
      INVALID_CREDENTIALS: "Invalid credentials"
    },
    SUCCESS: {
      REGISTERED: "User registered successfully",
    }
  }
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  FORBIDDEN:403
};