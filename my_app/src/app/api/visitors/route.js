import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb"; // Database connection
import {Visitor} from "@/app/models/Item"; // Visitor model
import {Apartment} from "@/app/models/Item"; // Apartment model
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
 // Auth middleware

// 🔹 Insert Visitor Info (POST)
export async function POST(req) {
  try {
           // Extract token from cookies
           const cookieStore = await cookies();
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
    
   
           // Parse request body
           const { apartmentId, visitorName, phoneNumber, entryDate, exitDate } = await req.json();
           if (!apartmentId || !visitorName || !phoneNumber || !entryDate || !exitDate) {
               return NextResponse.json({ message: "Invalid input" }, { status: 400 });
           }
   
           // Connect to MongoDB
           await dbConnect();
   
           // Find apartment
           const apartment = await Apartment.findOne({ apartmentId });
           if (!apartment) {
               return NextResponse.json({ message: "Apartment not found" }, { status: 400 });
           }
   
           // Create new visitor entry
           const visitor = new Visitor({
               apartmentId: apartment._id,
               visitorName,
               phoneNumber,
               entryDate,
               exitDate,
               createdBy:user.user.userId, // Ensure consistency
           });
   
           await visitor.save();
   
           return NextResponse.json({ uniqueCode: visitor.uniqueCode }, { status: 201 });
   
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}

// 🔹 Get All Visitors (GET) - Admin Only
export async function GET(req) {
  try {
    // Authenticate and authorize admin
    

    // Connect to MongoDB
    await dbConnect();
  
    // Fetch all visitors with apartment details
    const visitors = await Visitor.find().populate("apartmentId", "name _id");

    // Format data properly for frontend
      console.log(visitors)

    // console.log(updatedVisitors)

    return NextResponse.json(visitors, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
