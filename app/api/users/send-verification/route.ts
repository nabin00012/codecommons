import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const { db } = await connectToDatabase();

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with verification token
    await db.collection("users").updateOne(
      { email: decoded.email },
      {
        $set: {
          verificationToken,
          verificationExpires,
        },
      }
    );

    const user = await db.collection("users").findOne({ email: decoded.email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Create verification link
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    console.log("=".repeat(80));
    console.log("EMAIL VERIFICATION LINK");
    console.log("=".repeat(80));
    console.log(`To: ${decoded.email}`);
    console.log(`Link: ${verificationLink}`);
    console.log("=".repeat(80));

    // For now, the verification link is logged to console
    // This is perfect for testing and development
    // When you're ready for production, you can add email service
    
    return NextResponse.json({
      success: true,
      message: "Verification link generated! Check your browser console to see the link.",
      // Include the link in response so user can access it easily
      verificationLink: verificationLink,
      instructions: "In development: Copy the link from console. In production: Link will be sent via email."
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
