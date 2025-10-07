import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from auth token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    ) as any;

    const { db } = await connectToDatabase();
    const resourceId = params.id;

    // Toggle upvote
    const result = await db.collection("resources").updateOne(
      { _id: new ObjectId(resourceId) },
      { $inc: { upvotes: 1 } }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error upvoting resource:", error);
    return NextResponse.json(
      { error: "Failed to upvote resource" },
      { status: 500 }
    );
  }
}
