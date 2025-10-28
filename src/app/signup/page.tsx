"use client"

import { signUp } from "@/lib/actions/auth-actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      await signUp(email, password, name)
    }

  return (
    <div className="w-full h-screen bg-background-theme mx-auto flex flex-col items-center justify-center space-y-3">
      <Image alt="logo" src="/images/logo.png" width={40} height={40} />
      <h1 className="text-center text-primary-text font-bold text-5xl py-4">
        Sign up to start listening
      </h1>

      {/* Manual login */}
      <form onSubmit={handleSubmit} className="w-[350px] space-y-3">
        <div className="flex flex-col w-full space-y-2">
          <span className="text-primary-text font-bold text-sm">
            Email address
          </span>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@gmail.com"
            className="text-primary-text border border-secondary-text rounded-md focus:outline-primary-text placeholder:text-secondary-text p-3 transition-all duration-300"
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <span className="text-primary-text font-bold text-sm">Password</span>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            placeholder="Password"
            className="text-primary-text border border-secondary-text rounded-md focus:outline-primary-text placeholder:text-secondary-text p-3 transition-all duration-300"
          />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <span className="text-primary-text font-bold text-sm">Name</span>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="text-primary-text border border-secondary-text rounded-md focus:outline-primary-text placeholder:text-secondary-text p-3 transition-all duration-300"
          />
        </div>
        <button className="w-full bg-primary-button font-bold p-3 rounded-full hover:scale-105 hover:bg-secondary cursor-pointer transition-all duration-300">
          Sign up
        </button>
      </form>

      <span className="text-primary-text">or</span>

      {/* Provider login */}
      <div className="w-[350px] space-y-4">
        <button className="w-full flex items-center justify-between px-8 font-bold text-primary-text border border-secondary-text rounded-full p-3 hover:scale-105 hover:outline-primary-text cursor-pointer transition-all duration-300">
          <Image
            alt="google"
            src="/images/google-logo.png"
            className="size-5"
            width={10}
            height={10}
          />
          Sign up with Google
          <div></div>
        </button>

      </div>

      {/* Sign up */}
      <div className="flex flex-col items-center pt-8">
        <span className="text-secondary-text">Already have an account?</span>
        <Link
          href="/login"
          className="text-primary-text font-bold hover:scale-105 transition-all duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
