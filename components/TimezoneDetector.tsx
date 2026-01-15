"use client"

import { useEffect } from 'react';

export function TimezoneDetector() {
  useEffect(() => {
    //* get user timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const currentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-timezone='))
      ?.split('=')[1]

    //* if timezone changed, set new timezone
    // -> makes the app reactive to change of timezone. Should correctly handle the "today" redirect because the app gets launched at a different URL
    if (currentCookie !== timezone) {
      document.cookie = `user-timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [])

  return null
}
