import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, department, section, year, specialization, onboardingCompleted } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (section) updateData.section = section;
    if (year) updateData.year = year;
    if (specialization) updateData.specialization = specialization;
    if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;

    const result = await db.collection("users").updateOne(
      { email: email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get updated user
    const updatedUser = await db.collection("users").findOne({
      email: email
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}