"use client"

import { useEffect } from 'react';

export function TimezoneDetector() {
  useEffect(() => {
    const currentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-timezone='))

    if (!currentCookie) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      document.cookie = `user-timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [])

  return null
}
