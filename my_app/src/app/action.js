"use server"

import { dbConnect} from "./lib/mongodb"
import {User} from "./models/Item"
import bcrypt from "bcrypt";
import { SignJWT} from "jose";
import dotenv from 'dotenv';
import { cookies } from "next/headers";

dotenv.config();




export async function UserRegister(username,email,password,role){

    try{
        await dbConnect();

        const existingUser=await User.findOne({email});

        if(existingUser){
            return {success:false,message:"User Already Exists"}
        }

      const hashedPassword= await bcrypt.hash(password,12);
    
       const UserRegisterpost= new User({email,password:hashedPassword,role,username});
       
       
       await UserRegisterpost.save();


       return {success:true,message:"Registration Successful!"}

    }
    catch(error){
       console.error("Error during user registration",error);
       
       return {success:false,message:"An error occured during registration"}
    }

}




export async function UserLogin(email, password) {
    const SECRET_KEY = process.env.JWT_SECRET_KEY; // Ensure consistency
    console.log(SECRET_KEY)
    await dbConnect();

    console.log(email, password);
    const user = await User.findOne({ email });

    if (!user) return { success: false, message: "User not Found" };

    console.log(user.password);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return { success: false, message: "Invalid Credentials" };

    const key = new TextEncoder().encode(SECRET_KEY); // Correct key encoding

    // Securely sign JWT with user ID
    const token = await new SignJWT({ 
        user: { 
            userId: user._id.toString(), 
            username: user.name, 
            role: user.role 
        } 
    })
    .setIssuedAt()
    .setExpirationTime("1h")
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(key);
    

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
    });

    return { success: true, message: "Login successful", token,user: {
        userId: user._id.toString(),  // Convert ObjectId to string
        username: user.name,
        role: user.role,
        email: user.email,
    } };
}
