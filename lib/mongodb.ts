import { MongoClient, Db } from "mongodb";

const getMongoConfig = () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (!process.env.MONGODB_DB) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
  }

  return {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB,
  };
};

const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const getClientPromise = () => {
  if (!clientPromise) {
    const config = getMongoConfig();
    if (process.env.NODE_ENV !== "production") {
      try {
        const masked = config.uri.replace(/:\w+@/, ":****@");
        console.log("MongoDB connecting to:", masked);
      } catch {
        // noop
      }
    }

    if (process.env.NODE_ENV === "development") {
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(config.uri, options);
        globalWithMongo._mongoClientPromise = client
          .connect()
          .then((client) => client)
          .catch((err) => {
            console.error("MongoDB connection error:", err);
            throw err;
          });
      }
      clientPromise = globalWithMongo._mongoClientPromise;
    } else {
      client = new MongoClient(config.uri, options);
      clientPromise = client
        .connect()
        .then((client) => client)
        .catch((err) => {
          console.error("MongoDB connection error:", err);
          throw err;
        });
    }
  }
  return clientPromise;
};

export async function connectToDatabase() {
  try {
    const config = getMongoConfig();
    const client = await getClientPromise();
    const db = client.db(config.dbName);
    return { client, db };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

// Export a client promise for adapters that expect a promise instance
const clientPromiseDefault = getClientPromise();
export default clientPromiseDefault;
