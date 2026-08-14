import { MongoClient, ServerApiVersion } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function createMongoClient(uri: string) {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 5_000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  return client.connect().catch((error: unknown) => {
    globalForMongo.mongoClientPromise = undefined;
    throw error;
  });
}

export function getMongoClient() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  globalForMongo.mongoClientPromise ??= createMongoClient(uri);

  return globalForMongo.mongoClientPromise;
}
