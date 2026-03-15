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
export function get_yyyymmdd_date(date?: Date) {
  const dateObj = date || new Date()
  const offset = dateObj.getTimezoneOffset()
  const adjustedISOdate = new Date(dateObj.getTime() - (offset * 60 * 1000))
  return adjustedISOdate.toISOString().split('T')[0]
}


// formats number to german decimal number format, e.g.: 1.234,56
export function getGermanNumber(number: number, maximumFractionDigits: number = 2) {
  return new Intl.NumberFormat("de-DE", { style: "decimal", maximumFractionDigits }).format(number)
}

// formats date to german date format, e.g.: 18.07.2025
export function getGermanDate(date: Date) {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

// formats date to german date time, e.g.: 14:27
export function getGermanTime(date: Date) {
  return date.toLocaleTimeString("de-DE", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
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
  // return journalDayDate === "today" || journalDayRegex.test(journalDayDate)
  return journalDayRegex.test(journalDayDate)
}


//* from: https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b?permalink_comment_id=5458062#gistcomment-5458062
type Success<T> = {
  data: T;
  error?: never;
};

type Failure<E> = {
  data?: never;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

type MaybePromise<T> = T | Promise<T>;

export function tryCatch<T, E = Error>(
  arg: Promise<T> | (() => MaybePromise<T>)
): Result<T, E> | Promise<Result<T, E>> {
  if (typeof arg === 'function') {
    try {
      const result = arg();

      return result instanceof Promise ? tryCatch(result) : { data: result };
    } catch (error) {
      return { error: error as E };
    }
  }

  return arg
    .then((data) => ({ data }))
    .catch((error) => ({ error: error as E }));
}


// Source - https://stackoverflow.com/a/21742107
// Posted by feeela, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS";
  }

  return "unknown";
}


/**
 * creates a date object with offset by the users timezone 
 * @param headers Headers: request headers
 * @returns Date: local offset date
 */
export function getUserLocalDateNow(headers: Headers) {
  // get today's date in user's local timezone from cookie
  const timezoneCookie = headers.get("user-timezone")
  const timeZone = timezoneCookie || "Europe/Berlin" // fallback timezone

  // create today's date in user timezone
  const now = new Date()
  const offsetMs = getTimezoneOffsetMs(now, timeZone)
  const userLocalNow = new Date(now.getTime() + offsetMs)

  return userLocalNow
}


/**
 * calculates the offset in ms for a date relative to passed timezone
 * @param date Date: current date
 * @param tz string: timezone
 * @returns number: offset time in ms
 */
export function getTimezoneOffsetMs(date: Date, tz: string) {
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: tz }));
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return tzDate.getTime() - utcDate.getTime();
}
