import { NextResponse } from "next/server";

import { dbConnect } from "@/app/lib/mongodb"; // Database connection
import {Apartment} from "@/app/models/Item"; // Apartment model
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
 // JWT authentication

export async function POST(req) {
  try {
       // Extract token from cookies
         // Extract token from cookies
  
    // Parse request body
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();
  console.log(name)
    // Create and save apartment
    const apartment = new Apartment({ name });
    await apartment.save();

    return NextResponse.json({ message: "Apartment created" }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}



  export async function GET(req) {
    try {
    
      // Connect to MongoDB
      await dbConnect();
  
      // Fetch apartments (return only apartmentId and name)
      const apartments = await Apartment.find().select("apartmentId name -_id");
     
      console.log(apartments)
      return NextResponse.json(apartments, { status: 200 });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }
  }
  
  