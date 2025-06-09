"use client";

import axios from "axios";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/api/user", {
        name: e.currentTarget.fullName.value,
        email: e.currentTarget.email.value,
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
        passwordConfirmation: e.currentTarget.passwordConfirmation.value,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.email) router.push("/signin");
      })
      .catch((err) => {
        console.log(err);

        if (err.response.data.details)
          toast(
            (
              Object.values(err.response.data.details)[0] as string[]
            )[0] as string
          );
        else toast("Something went wrong.");
      });
  };

  return (
    <div className="w-[400px] flex items-center justify-center text-white flex-col">
      <h1 className="text-2xl">Sign Up</h1>
      <form
        className="mt-10 flex flex-col gap-5"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="passwordConfirmation"
          className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg"
        />
        <button className="w-full text-lg text-white outline-none cursor-pointer px-5 py-3 rounded-lg bg-blue-400">
          Submit
        </button>
      </form>
      <button
        onClick={() => signIn("google", {redirectTo: "/"})}
        className="w-full text-lg border border-blue-400 outline-none text-blue-400 px-5 py-3 rounded-lg flex items-center justify-center gap-5 mt-7 cursor-pointer"
      >
        <img src={"https://cdn-icons-png.flaticon.com/128/300/300221.png"}  className="w-7" />
        Google
      </button>
      <p className="mt-5">Already have an account <Link href={"/signin"} className="text-blue-400">Sign In</Link></p>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
