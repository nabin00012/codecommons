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
    let userId: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
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
        userId = data.user._id;
      } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // Session-based authentication
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        console.log("No session found");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

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
      console.log("Querying user with ID:", userId);
      const userObjectId = new ObjectId(userId);
      console.log("Converted ID to ObjectId:", userObjectId);

      user = await db.collection("users").findOne({ _id: userObjectId });
      console.log("User query result:", user ? "User found" : "User not found");
      if (user) {
        console.log("User data:", {
          _id: user._id,
          name: user.name,
          email: user.email,
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
      console.log("Querying languages for user:", userId);
      const userObjectId = new ObjectId(userId);
      languages = await db
        .collection<Language>("userLanguages")
        .find({ userId: userObjectId })
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
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    let userId: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
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
        userId = data.user._id;
      } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // Session-based authentication
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        console.log("No session found");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

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
        { _id: new ObjectId(userId) },
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
          .deleteMany({ userId: new ObjectId(userId) });

        console.log("Deleted existing languages:", deleteResult.deletedCount);

        // Insert new language proficiencies
        if (data.languages.length > 0) {
          const languageDocs = data.languages.map((lang: any) => ({
            language: lang.name,
            proficiency: lang.proficiency,
            userId: new ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          const insertResult = await db
            .collection("userLanguages")
            .insertMany(languageDocs);

          console.log("Inserted new languages:", insertResult.insertedCount);
        }
      } catch (langError) {
        console.error("Language update error:", langError);
        // Continue even if language update fails
      }
    }

    // Fetch the updated user data
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    const updatedLanguages = await db
      .collection("userLanguages")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    const responseData = {
      name: updatedUser?.name || "",
      email: updatedUser?.email || "",
      location: updatedUser?.location || "",
      course: updatedUser?.course || "",
      semester: updatedUser?.semester || "",
      bio: updatedUser?.bio || "",
      githubUrl: updatedUser?.githubUrl || "",
      linkedinUrl: updatedUser?.linkedinUrl || "",
      portfolioUrl: updatedUser?.portfolioUrl || "",
      skills: updatedUser?.skills || [],
      languages: updatedLanguages.map((lang) => ({
        name: lang.language,
        proficiency: lang.proficiency,
      })),
    };

    return NextResponse.json(responseData);
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
