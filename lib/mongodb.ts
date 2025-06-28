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
    console.log("MongoDB URI:", config.uri); // Log the URI (without credentials)

    if (process.env.NODE_ENV === "development") {
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(config.uri, options);
        globalWithMongo._mongoClientPromise = client
          .connect()
          .then((client) => {
            console.log("MongoDB connected successfully");
            return client;
          })
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
        .then((client) => {
          console.log("MongoDB connected successfully");
          return client;
        })
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
    console.log("Attempting to connect to database...");
    const config = getMongoConfig();
    const client = await getClientPromise();
    const db = client.db(config.dbName);
    console.log("Successfully connected to database:", config.dbName);
    return { client, db };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default getClientPromise;
