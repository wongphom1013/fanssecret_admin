// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl.clone();

//   if (!token && url.pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
//     if (url.pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("user_role")?.value === "admin";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
