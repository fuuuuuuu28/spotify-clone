import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGO_URL!;
// console.log("first", MONGODB_URL);
if (!MONGODB_URL) {
  throw new Error("❌ Missing MONGO_URL in env");
}

const globalForMongoose = global as typeof globalThis & {
  mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

const cached =
  globalForMongoose.mongoose ??
  (globalForMongoose.mongoose = {
    conn: null,
    promise: null,
  });

export async function connectionToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 20000,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached?.conn;
}
