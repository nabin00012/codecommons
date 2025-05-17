import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId, WithId, Document } from "mongodb";
import jwt from "jsonwebtoken";

interface Language extends Document {
  language: string;
  proficiency: number;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

function getTokenFromHeader(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

function verifyToken(token: string): { id: string } {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };
    console.log("Token verification successful:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
}

export async function GET(request: Request) {
  let db;
  try {
    console.log("Starting profile GET request...");

    const token = getTokenFromHeader(request);
    if (!token) {
      console.log("No token found in request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log("Token decoded:", decoded);

    try {
      console.log("Attempting to connect to database...");
      const connection = await connectToDatabase();
      db = connection.db;
      console.log("Connected to database successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    let user;
    try {
      console.log("Querying user with ID:", decoded.id);
      const userId = new ObjectId(decoded.id);
      console.log("Converted ID to ObjectId:", userId);

      user = await db.collection("users").findOne({ _id: userId });
      console.log("User query result:", user ? "User found" : "User not found");
      if (user) {
        console.log("User data:", {
          _id: user._id,
          name: user.name,
          email: user.email,
          // Don't log sensitive data
        });
      }
    } catch (queryError) {
      console.error("User query error:", queryError);
      if (queryError instanceof Error) {
        console.error("Error details:", {
          message: queryError.message,
          stack: queryError.stack,
        });
      }
      return NextResponse.json(
        {
          error: "Failed to fetch user data",
          details:
            queryError instanceof Error ? queryError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let languages: WithId<Language>[] = [];
    try {
      console.log("Querying languages for user:", decoded.id);
      const userId = new ObjectId(decoded.id);
      languages = await db
        .collection<Language>("userLanguages")
        .find({ userId })
        .toArray();
      console.log("Languages found:", languages.length);
    } catch (langError) {
      console.error("Language query error:", langError);
      if (langError instanceof Error) {
        console.error("Error details:", {
          message: langError.message,
          stack: langError.stack,
        });
      }
      // Continue without languages if there's an error
    }

    const response = {
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      course: user.course || "",
      semester: user.semester || "",
      bio: user.bio || "",
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      portfolioUrl: user.portfolioUrl || "",
      skills: user.skills || [],
      languages: languages.map((lang) => ({
        name: lang.language,
        proficiency: lang.proficiency,
      })),
    };

    console.log("Sending response:", JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in profile API:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  let db;
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      console.log("No token found in request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log("Token decoded:", decoded);

    try {
      const connection = await connectToDatabase();
      db = connection.db;
      console.log("Connected to database successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    const data = await request.json();
    console.log("Request data:", data);

    // Validate required fields
    if (!data.name) {
      console.log("Name is required");
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let updateResult;
    try {
      updateResult = await db.collection("users").updateOne(
        { _id: new ObjectId(decoded.id) },
        {
          $set: {
            name: data.name,
            location: data.location || "",
            course: data.course || "",
            semester: data.semester || "",
            bio: data.bio || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            portfolioUrl: data.portfolioUrl || "",
            skills: data.skills || [],
            updatedAt: new Date(),
          },
        }
      );
      console.log("Update result:", updateResult);
    } catch (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        {
          error: "Failed to update user data",
          details:
            updateError instanceof Error
              ? updateError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    if (updateResult.matchedCount === 0) {
      console.log("User not found for update");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update language proficiencies
    if (data.languages && Array.isArray(data.languages)) {
      console.log("Updating languages:", data.languages.length);

      try {
        // Remove existing language proficiencies
        const deleteResult = await db
          .collection("userLanguages")
          .deleteMany({ userId: new ObjectId(decoded.id) });

        console.log("Deleted existing languages:", deleteResult.deletedCount);

        // Insert new language proficiencies
        if (data.languages.length > 0) {
          const insertResult = await db.collection("userLanguages").insertMany(
            data.languages.map((lang: any) => ({
              userId: new ObjectId(decoded.id),
              language: lang.name,
              proficiency: lang.proficiency,
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
          );
          console.log("Inserted new languages:", insertResult.insertedCount);
        }
      } catch (langError) {
        console.error("Language update error:", langError);
        // Continue even if language update fails
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in profile update API:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
