import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { nextUrl } = request;

  if (
    token &&
    (nextUrl.pathname.startsWith("/sign-in") ||
      nextUrl.pathname.startsWith("/sign-up") ||
      nextUrl.pathname.startsWith("/verify") ||
      nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*"],
};
