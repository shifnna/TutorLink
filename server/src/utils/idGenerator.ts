import { randomBytes } from "crypto";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars like 0/O, 1/I

function randomCode(length: number): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  return code;
}

export function generateRuleCode(): string {
  return `RULE-TL-${randomCode(6)}`;
}

export function generateSessionId(date: string, time: string): string {
  return `SES-${date.replaceAll("-", "")}-${time.replace(":", "")}-${randomCode(5)}`;
}