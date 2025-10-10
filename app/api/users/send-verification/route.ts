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

    // In development, show the link in console
    // In production, you would integrate with an email service like:
    // - Resend: https://resend.com
    // - SendGrid: https://sendgrid.com  
    // - AWS SES: https://aws.amazon.com/ses/
    // - Nodemailer with SMTP
    
    // Example with Resend (recommended):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'CodeCommons <noreply@codecommons.com>',
      to: decoded.email,
      subject: "Verify your email - CodeCommons",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Verify Your Email</h1>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
          <p style="color: #666; margin-top: 20px;">This link will expire in 24 hours.</p>
        </div>
      `
    });
    */

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully. Check your console for the verification link.",
      // For demo purposes, include the link in response (remove in production)
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
