import { NextResponse, type NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const referrer = request.headers.get("referer")
  const { pathname, origin } = request.nextUrl

  if (pathname.startsWith("/app/journal/today")) {
    return NextResponse.next()
  }

  // parse referrer safely
  let referrerPathname = ""
  if (referrer) {
    try {
      const refUrl = new URL(referrer)
      // check if is internal referrer
      if (refUrl.origin === origin) {
        referrerPathname = refUrl.pathname
      }
    } catch (e) { }
  }

  // redirect to /today only if user is navigating to /journal from a different route than /journal:path* 
  if (referrerPathname && !referrerPathname.startsWith("/app/journal")) {
    // get today's date in user's local timezone from cookie
    const timezoneCookie = request.cookies.get('user-timezone')?.value
    const timeZone = timezoneCookie || 'Europe/Berlin' // fallback timezone

    // create today's date in user timezone and format as YYYY-MM-DD
    const now = new Date()
    const yyyymmdd_dateString = now.toLocaleDateString('en-CA', { timeZone })

    return NextResponse.redirect(new URL(`/app/journal/${yyyymmdd_dateString}`, request.nextUrl), {
      status: 307,
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/app/journal", // should only run for one route
}
