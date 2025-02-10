import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import dotenv from "dotenv";
import { User } from '../models/Item.js';
dotenv.config(); 
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export const dbConnect =async()=>{
  try{
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to Mongodb")
  }
  catch(error){
    console.error(error.message)
    process.exit(1)
  }
}




export const  createDefaultAdmin = async () => {
  await dbConnect(); // Ensure database is connected
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  const password="admin"

  const hashedPassword= await bcrypt.hash(password,12);

  if (!existingAdmin) {
    await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword, 
      role: "admin",
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
  
  mongoose.connection.close(); // Close connection after operation
};

