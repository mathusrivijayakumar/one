import { jwtVerify } from "jose";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Ensure consistency
const key = new TextEncoder().encode(SECRET_KEY);

export const verifyToken = async (token) => {
    try {
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined");
        }
        console.log("JWT Token:", token);
        console.log("JWT Secret Key:", SECRET_KEY);

        // Verify the JWT with the secret key
        const { payload } = await jwtVerify(token, key);

        
        return payload; // Return decoded payload
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return null; // Return null if verification fails
    }
};