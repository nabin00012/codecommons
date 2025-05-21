import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, secret);
      console.log("Token decoded:", decoded);

      if (!decoded || typeof decoded === "string") {
        console.error("Invalid token format:", decoded);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      // Connect to database
      const { db } = await connectToDatabase();
      console.log("Connected to database");

      // Convert string ID to ObjectId
      let userId;
      try {
        userId = new ObjectId(decoded.id);
        console.log("Converted ID to ObjectId:", userId);
      } catch (error) {
        console.error("Invalid user ID format:", error);
        return NextResponse.json(
          { error: "Invalid user ID format" },
          { status: 400 }
        );
      }

      // Find user in database
      const user = await db
        .collection("users")
        .findOne({ _id: userId }, { projection: { password: 0 } });
      console.log("User query result:", user ? "User found" : "User not found");

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("JWT verification error:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
