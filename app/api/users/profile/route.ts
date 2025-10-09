import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl?.searchParams?.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      name,
      role, 
      department, 
      section, 
      year, 
      specialization, 
      onboardingCompleted,
      bio,
      phone,
      location,
      github,
      linkedin,
      twitter,
      website
    } = body;

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

    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (section !== undefined) updateData.section = section;
    if (year !== undefined) updateData.year = year;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (website !== undefined) updateData.website = website;

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