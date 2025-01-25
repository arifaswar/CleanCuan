import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenJose } from "./helpers/jwt";

export async function middleware(request: NextRequest) {
  const authorization = cookies().get("authorization")?.value;
  if (!authorization)
    return NextResponse.json(
      {
        mesesage: "Invalid token",
      },
      {
        status: 401,
      }
    );

  const token = authorization.split(" ")[1];

  const decode = await verifyTokenJose<{ _id: string; email: string }>(token);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", decode._id);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    "/api/outlets/:path*",
    "/api/employees/:path*",
    "/api/transaction/:path*",
    "/api/oprationals/:path*",
    "/api/report/yearly/:path*",
    "/api/report/monthly/:path*",
    "/api/report/daily/:path*",
    "/api/customers/:path*",
  ],
};
