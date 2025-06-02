import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId, WithId, Document } from "mongodb";

interface Language extends Document {
  language: string;
  proficiency: number;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  let db;
  try {
    console.log("Starting profile GET request...");

    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token-based authentication
    const token = authHeader.split(" ")[1];
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const data = await response.json();
      const userId = data.user._id;

      try {
        console.log("Attempting to connect to database...");
        const connection = await connectToDatabase();
        db = connection.db;
        console.log("Connected to database successfully");

        console.log("Querying user with ID:", userId);
        const userObjectId = new ObjectId(userId);
        console.log("Converted ID to ObjectId:", userObjectId);

        const user = await db
          .collection("users")
          .findOne({ _id: userObjectId });
        console.log(
          "User query result:",
          user ? "User found" : "User not found"
        );

        if (!user) {
          console.log("User not found");
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        let languages: WithId<Language>[] = [];
        try {
          console.log("Querying languages for user:", userId);
          languages = await db
            .collection<Language>("userLanguages")
            .find({ userId: userObjectId })
            .toArray();
          console.log("Languages found:", languages.length);
        } catch (langError) {
          console.error("Language query error:", langError);
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
      } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
          {
            error: "Database error",
            details:
              dbError instanceof Error ? dbError.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in profile API:", error);
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
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token-based authentication
    const token = authHeader.split(" ")[1];
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const data = await response.json();
      const userId = data.user._id;

      try {
        const connection = await connectToDatabase();
        db = connection.db;
        console.log("Connected to database successfully");

        const updateData = await request.json();
        console.log("Request data:", updateData);

        // Validate required fields
        if (!updateData.name) {
          console.log("Name is required");
          return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
          );
        }

        const updateResult = await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              name: updateData.name,
              location: updateData.location || "",
              course: updateData.course || "",
              semester: updateData.semester || "",
              bio: updateData.bio || "",
              githubUrl: updateData.githubUrl || "",
              linkedinUrl: updateData.linkedinUrl || "",
              portfolioUrl: updateData.portfolioUrl || "",
              skills: updateData.skills || [],
              updatedAt: new Date(),
            },
          }
        );

        if (updateResult.matchedCount === 0) {
          console.log("User not found for update");
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Get updated user data
        const updatedUser = await db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) });
        if (!updatedUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Get updated languages
        const updatedLanguages = await db
          .collection<Language>("userLanguages")
          .find({ userId: new ObjectId(userId) })
          .toArray();

        const responseData = {
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          location: updatedUser.location || "",
          course: updatedUser.course || "",
          semester: updatedUser.semester || "",
          bio: updatedUser.bio || "",
          githubUrl: updatedUser.githubUrl || "",
          linkedinUrl: updatedUser.linkedinUrl || "",
          portfolioUrl: updatedUser.portfolioUrl || "",
          skills: updatedUser.skills || [],
          languages: updatedLanguages.map((lang) => ({
            name: lang.language,
            proficiency: lang.proficiency,
          })),
        };

        return NextResponse.json(responseData);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
          {
            error: "Database error",
            details:
              dbError instanceof Error ? dbError.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in profile update:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
