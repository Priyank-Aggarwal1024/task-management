import { NextResponse } from "next/server";

export function middleware(req) {
  const authToken = req.cookies.get("auth_token")?.value; // Read from cookies

  if (!authToken) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // Protect the root route "/"
};
