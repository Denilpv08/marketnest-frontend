import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = ["/admin"];
const superadminRoutes = ["/superadmin"];
const authRoutes = ["/cart", "/orders", "/appointments"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isSuperadminRoute = superadminRoutes.some((r) =>
    pathname.startsWith(r),
  );
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  if ((isAdminRoute || isSuperadminRoute || isAuthRoute) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
    "/cart",
    "/orders/:path*",
    "/appointments/:path*",
  ],
};
