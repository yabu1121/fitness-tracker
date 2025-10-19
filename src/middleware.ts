import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith('/auth')
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isPublicFile = nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)

  // Allow public files
  if (isPublicFile) {
    return NextResponse.next()
  }

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', nextUrl))
    }
    return NextResponse.next()
  }

  // Protect all other routes
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
