export function isValidName(name: string) {
  return /^[A-Za-z\s]+$/.test(name.trim());
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isValidPhone(phone: string) {
  // Basic 10-digit phone validation, adjust for your locale
  return /^\d{10}$/.test(phone);
}

export function isStrongPassword(password: string) {
  // Example rule: min 8 characters. Add complexity rules if you want.
  return password.length >= 8;
}
