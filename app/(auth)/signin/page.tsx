"use client";

import axios from "axios";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <div className="w-[400px] flex items-center justify-center text-white flex-col">
      <h1 className="text-2xl">Sign In</h1>
      <form className="mt-10 flex flex-col gap-5" action={credentialsAction}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <button className="w-full text-lg text-white outline-none cursor-pointer px-5 py-3 rounded-lg bg-blue-400">
          Submit
        </button>
      </form>
      <button
        onClick={() => signIn("google", { redirectTo: "/" })}
        className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg flex items-center justify-center gap-5 mt-7 cursor-pointer"
      >
        <img
          src={"https://cdn-icons-png.flaticon.com/128/300/300221.png"}
          className="w-7"
        />
        Google
      </button>
      <p className="mt-5">
        Don't have an account{" "}
        <Link href={"/signup"} className="text-blue-400">
          Sign Up
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
