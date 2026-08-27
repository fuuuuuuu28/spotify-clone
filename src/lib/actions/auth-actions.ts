"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

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
  } catch (error: unknown) {
    console.log("lib/auth-action/signUp error", error);

    return {
      error: "Đăng ký thất bại",
    };
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
  } catch (error: unknown) {
    console.log("lib/auth-action/signIp error", error);

    return {
      error: "Đăng nhập thất bại",
    };
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });
  return result;
};
