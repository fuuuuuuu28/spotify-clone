"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { success } from "better-auth";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return {data: result};
  } catch (error: any) {
    console.log("lib/auth-action/signUp error", error.body.message);
    return {error: error.body.message}
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {data: result};
  } catch (error: any) {
    console.log("lib/auth-action/signIp error", error.body.message);
    return {error: error.body.message}
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });
  return result;
};
