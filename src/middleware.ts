import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  // Nếu chưa login mà cố vào /app => redirect về /
  if (!sessionCookie && request.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu đã login mà vẫn vào trang / (login page) => redirect sang /app
  if (sessionCookie && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/app/:path"], // Specify the routes the middleware applies to
};
