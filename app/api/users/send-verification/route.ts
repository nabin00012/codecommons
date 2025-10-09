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

    // In a real application, you would send an email here
    // For now, we'll just log the verification link
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    console.log("=".repeat(80));
    console.log("EMAIL VERIFICATION LINK");
    console.log("=".repeat(80));
    console.log(`To: ${decoded.email}`);
    console.log(`Link: ${verificationLink}`);
    console.log("=".repeat(80));

    // TODO: Send actual email using nodemailer or another service
    // Example:
    // await sendEmail({
    //   to: decoded.email,
    //   subject: "Verify your email",
    //   html: `Click here to verify: <a href="${verificationLink}">${verificationLink}</a>`
    // });

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
      // For demo purposes, include the link in response
      verificationLink: process.env.NODE_ENV === "development" ? verificationLink : undefined,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
