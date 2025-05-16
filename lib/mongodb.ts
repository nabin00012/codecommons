import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  maxIdleTimeMS: 60000, // Close idle connections after 60s
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("MongoDB client connected");

    const db = client.db(process.env.MONGODB_DB);
    console.log("Connected to database:", process.env.MONGODB_DB);

    // Test the connection with a timeout
    const pingPromise = db.command({ ping: 1 });
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("MongoDB ping timeout")), 5000);
    });

    await Promise.race([pingPromise, timeoutPromise]);
    console.log("MongoDB connection test successful");

    // Verify we can access the collections we need
    const collections = ["questions", "users"];
    for (const collection of collections) {
      try {
        await db.collection(collection).findOne({});
        console.log(`Successfully accessed ${collection} collection`);
      } catch (error) {
        console.error(`Error accessing ${collection} collection:`, error);
        throw new Error(`Failed to access ${collection} collection`);
      }
    }

    return { client, db };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
