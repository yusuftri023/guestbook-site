import { NextResponse, type NextRequest } from "next/server";

// Define allowed routes that do not require authentication

export async function middleware(req: NextRequest) {
  return NextResponse.next(); // Continue if authenticated
}
