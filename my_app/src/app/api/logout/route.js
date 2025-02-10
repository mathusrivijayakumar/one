import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Clear the token by setting an empty value and expiring it immediately

  const cookieStore = await cookies();
    
   cookieStore.set({
    name: "token",
    value: "",
    expires: new Date(0), // Expire the cookie immediately
    path: "/",
  });

  return NextResponse.json({ message: "Logged out successfully" });
}