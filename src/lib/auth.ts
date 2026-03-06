import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import mongoose from "mongoose";
import { connectionToDatabase } from "./mongoose";
import { Db } from "mongodb";

await connectionToDatabase();

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db as unknown as Db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [nextCookies()],
});
