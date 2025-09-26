import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Testing database connection...");
    const { db } = await connectToDatabase();
    console.log("Database connected successfully");
    
    const testDoc = await db.collection("users").findOne({});
    console.log("Test query successful, found user:", testDoc ? "yes" : "no");
    
    return NextResponse.json({
      status: "success",
      message: "Database connection working",
      hasUsers: !!testDoc,
      mongoUri: process.env.MONGODB_URI ? "set" : "missing",
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? "set" : "missing",
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error",
        mongoUri: process.env.MONGODB_URI ? "set" : "missing",
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? "set" : "missing",
      },
      { status: 500 }
    );
  }
}
