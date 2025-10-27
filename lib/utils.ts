import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * username validator, checks for length, trailing whitespaces and for generic characters:
 * /^[A-Za-z0-9_. ]+$/ -> alphanummeric letters, numbers, dots, underscores and whitespaces
 *
 * @param username
 * @returns Object { valid: boolean, if invalid - reason: string }
 */
export function validateUsername(username: string) {
  //* length check
  if (username.length < 1 || username.length > 16) {
    return {
      valid: false,
      reason: "Username must be between 1 and 16 characters long",
    };
  }

  //* no leading spaces
  if (username.startsWith(" ")) {
    return {
      valid: false,
      reason: "Username cannot start or end with a space",
    };
  }

  //* no leading or trailing spaces
  // if (username.startsWith(" ") || username.endsWith(" ")) {
  //   return { valid: false, reason: "Username cannot start or end with a space" };
  // }

  //* no consecutive spaces
  if (username.includes("  ")) {
    return {
      valid: false,
      reason: "Username cannot contain consecutive spaces",
    };
  }

  //* allowed characters only
  if (!/^[A-Za-z0-9_. ]+$/.test(username)) {
    return {
      valid: false,
      reason:
        "Username can only contain letters, numbers, underscores, dots, and spaces",
    };
  }

  return { valid: true };
}
