import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Starting answer submission process...");
    const { id } = params;
    console.log("Question ID:", id);

    // Parse request body
    let content;
    try {
      const body = await request.json();
      content = body.content;
      console.log("Request body parsed successfully");
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!content) {
      console.log("No content provided in request");
      return NextResponse.json(
        { success: false, message: "Answer content is required" },
        { status: 400 }
      );
    }

    // Verify authentication
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("No authorization token provided");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Verifying token...");
    const authData = await authService.verifyToken(token);
    if (!authData?.user) {
      console.log("Invalid token or user not found");
      return NextResponse.json(
        { success: false, message: "Invalid authentication" },
        { status: 401 }
      );
    }

    const user = authData.user;
    console.log("User authenticated:", user._id);

    // Forward the request to the backend API
    console.log("Forwarding request to backend API...");
    const response = await fetch(
      `${API_URL}/api/codecorner/questions/${id}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Backend API error:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData?.message || "Failed to post answer",
          error: errorData?.error || "Unknown error",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Backend API response:", data);

    // Create a properly structured response
    const answerData = {
      _id: data._id || data.id || crypto.randomUUID(),
      content: content,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      createdAt: new Date().toISOString(),
      votes: 0,
      isAccepted: false,
    };

    return NextResponse.json({
      success: true,
      data: answerData,
    });
  } catch (error) {
    console.error("Unexpected error in answer submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
