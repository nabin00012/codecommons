import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5050";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/codecorner/questions/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(
        errorData?.message ||
          errorData?.error ||
          `Failed to fetch question: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Raw backend data:", JSON.stringify(data, null, 2));

    if (!data || typeof data !== "object") {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from backend");
    }

    // Validate required fields
    if (!data._id || !data.title || !data.content) {
      console.error("Missing required fields in response:", data);
      throw new Error("Response missing required fields");
    }

    // Ensure all ObjectIds are converted to strings and validate data structure
    const serializedData = {
      ...data,
      _id: String(data._id),
      title: String(data.title),
      content: String(data.content),
      author: data.author
        ? {
            _id: String(data.author._id),
            name: String(data.author.name),
            email: String(data.author.email || ""),
            ...(data.author.role && { role: String(data.author.role) }),
            ...(data.author.semester && {
              semester: String(data.author.semester),
            }),
            ...(data.author.department && {
              department: String(data.author.department),
            }),
          }
        : null,
      createdAt: String(data.createdAt),
      updatedAt: String(data.updatedAt),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      language: data.language ? String(data.language) : undefined,
      views: data.views ? Number(data.views) : undefined,
      votes: Number(data.votes),
      answers: Array.isArray(data.answers)
        ? data.answers.map((answer: any) => {
            // Ensure content is a string
            let content = answer.content;
            if (typeof content === "object") {
              content = JSON.stringify(content);
            } else {
              content = String(content);
            }

            return {
              _id: String(answer._id),
              content: content,
              author: answer.author
                ? {
                    _id: String(answer.author._id),
                    name: String(answer.author.name),
                    email: String(answer.author.email || ""),
                    ...(answer.author.role && {
                      role: String(answer.author.role),
                    }),
                    ...(answer.author.semester && {
                      semester: String(answer.author.semester),
                    }),
                    ...(answer.author.department && {
                      department: String(answer.author.department),
                    }),
                  }
                : null,
              createdAt: String(answer.createdAt),
              votes: Number(answer.votes),
              isAccepted: Boolean(answer.isAccepted),
            };
          })
        : [],
      isSolved: Boolean(data.isSolved),
    };

    console.log("Serialized data:", JSON.stringify(serializedData, null, 2));
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch question",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
