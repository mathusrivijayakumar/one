import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb"; // Database connection
import {User} from "@/app/models/Item"; // User model
import jwt from "jsonwebtoken";


export async function POST(req, { params }) {
  try {
    const { token } = params; // Extract token from URL parameter
    const { newPassword } = await req.json();

    // Connect to MongoDB
    await dbConnect();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password has been reset" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Invalid token or token expired" }, { status: 400 });
  }
}
