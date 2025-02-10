import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb"; // Database connection
import {Visitor} from "@/app/models/Item"; // Visitor model
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
 // Token authentication utility

export async function GET(req) {
  
  try {
    
     // Extract token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode the token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Fetch the visitors created by the user
    const visitors = await Visitor.find({ createdBy: user.user.userId }).populate("apartmentId");

    if (visitors.length === 0) {
      return NextResponse.json({ message: "No visitors found" }, { status: 404 });
    }

    // Return the visitors
    return NextResponse.json(visitors);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 400 });
  }
}
