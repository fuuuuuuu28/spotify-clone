<<<<<<< HEAD
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGO_URL!;
// console.log("first", MONGODB_URL)
=======

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGO_URL!;
// console.log("first", MONGODB_URL);
>>>>>>> 4c8d154 (comeback)
if (!MONGODB_URL) {
  throw new Error("❌ Missing MONGO_URL in env");
}

let cached = (global as any).mongoose as {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectionToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
<<<<<<< HEAD
    cached.promise = mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    });
=======
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
>>>>>>> 4c8d154 (comeback)
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
