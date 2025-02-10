import { NextResponse } from "next/server";
import { dbConnect } from "@/app//lib/mongodb"; // Database connection
import {Apartment} from "@/app/models/Item"; // Apartment model
 // JWT authentication
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";

// 🔹 Edit Apartment Name (PUT)
export async function PUT(req, { params }) {
  try {

    // Extract apartment ID from URL params
    const { id } =await  params;
    if (!id) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    
    // Parse request body
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Update apartment
    const apartment = await Apartment.findOneAndUpdate(
      { 
        apartmentId: id },   // Ensure you're using the correct field (_id)
      { name },      // Update the `name` field
      { new: true }  // Return the updated document
    );

    console.log(apartment)

    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Apartment updated", apartment }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}

// 🔹 Delete Apartment (DELETE)
export async function DELETE(req, { params }) {
  try {
    // Extract apartment ID from URL params
    const { id } =await  params;
    if (!id) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const cookieStore =await  cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        console.error("JWT Token Missing in Cookie");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode the token
    const user = await verifyToken(token);
    if (!user) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
   console.log(user.user.userId)
    const { userId } = user;
console.log("User ID:", userId);

    // Check if user has "admin" role
    if (user.user.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Delete apartment
    const apartment = await Apartment.findOneAndDelete({ apartmentId:id });

    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Apartment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
