import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * username validator, checks for length, trailing whitespaces and for generic characters:
 * /^[A-Za-z0-9_. ]+$/ -> alphanummeric letters, numbers, dots, underscores and whitespaces
 *
 * @param username string
 * @returns Object { valid: boolean, reason?: string }
 */
export function validateUsername(username: string) {
  //* length check
  if (username.length < 1 || username.length > 25) {
    return {
      valid: false,
      reason: "Benutzername darf nur 1 bis 25 Zeichen enthalten"
    }
  }

  //* no leading spaces
  if (username.startsWith(" ")) {
    return {
      valid: false,
      reason: "Benutzername darf nicht mit einem Leerzeichen anfangen"
    }
  }

  //* no leading or trailing spaces
  // if (username.startsWith(" ") || username.endsWith(" ")) {
  //   return { valid: false, reason: "Username cannot start or end with a space" };
  // }

  //* no consecutive spaces
  if (username.includes("  ")) {
    return {
      valid: false,
      reason: "Benutzername darf keine aufeinanderfolgenden Leerzeichen enthalten"
    }
  }

  //* allowed characters only
  if (!/^[A-Za-z0-9_. ]+$/.test(username)) {
    return {
      valid: false,
      reason:
        "Benutzername darf nur Buchstaben, Ziffern, Unterstriche, Punkte und Leerzeichen enthalten"
    }
  }

  return { valid: true }
}
