export function isValidName(name: string) {
  return /^[A-Za-z\s]+$/.test(name.trim());
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isValidPhone(phone: string) {
  return /^\d{10}$/.test(phone);
}

export function isStrongPassword(password: string) {
  return password.length >= 8;
}
