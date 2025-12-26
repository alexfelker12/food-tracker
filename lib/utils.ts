import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { journalDayRegex } from "./constants"

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


// Source - https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd/7091965#comment124058518_7091965
// Posted by codeandcloud, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-08, License - CC BY-SA 3.0
//* adjusted to work with passed Date objects
export function getAge(dateOrDateString: string | Date) {
  var today = new Date();
  var birthDate = dateOrDateString instanceof Date ? dateOrDateString : new Date(dateOrDateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


// Source - https://stackoverflow.com/a/29774197
// Posted by Darth Egregious, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-04, License - CC BY-SA 4.0
//* adjusted to use as a function
export function get_yyyymmdd_date(date: Date) {
  const offset = date.getTimezoneOffset()
  const adjustedISOdate = new Date(date.getTime() - (offset * 60 * 1000))
  return adjustedISOdate.toISOString().split('T')[0]
}


// formats number to german decimal number format, e.g.: 1.234,56
export function getGermanNumber(number: number) {
  return new Intl.NumberFormat("de-DE", { style: "decimal" }).format(number)
}

// formats date to german date format, e.g.: 18.07.2025
export function getGermanDate(date: Date) {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}


// -- Source - https://stackoverflow.com/a/70276893
// -- Posted by Zenik
// -- Retrieved 2025-12-19, License - CC BY-SA 4.0
//* adjusted function name
export function offsetDate(date: Date) {
  return new Date(
    Date.parse(date.toUTCString()) - date.getTimezoneOffset() * 60000
  );
}


// check if string is a valid journalDayDate url ("today" | yyyy-mm-dd format)
export function isValidJournalDayDate(journalDayDate: string) {
  return journalDayDate === "today" || journalDayRegex.test(journalDayDate)
}
