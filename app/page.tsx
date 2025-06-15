"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    axios
      .get(`/api/adzuna`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <Header />
        <Sidebar />
        <div className="flex items-center h-full justify-center gap-10 mt-20 flex-col text-white">
          <h1 className="text-blue-400 text-3xl font-semibold">
            Aspirely — Your Personalized Career Growth Platform
          </h1>
          <p className="w-1/2 text-lg mt-10">
            Unlock your full potential with Aspirely. Get a fully customized
            career path tailored to your goals and interests — complete with
            recommended courses, in-demand skills, certifications, and job
            opportunities to help you grow and succeed. Start building your
            future today with a plan made just for you.
          </p>
          <div className="flex gap-10 mt-5">
            <Link href={"/path"} className="bg-blue-400 text-white px-5 py-3 rounded-lg cursor-pointer hover:scale-105">Find You Career Path</Link>
            <Link href={"/account"} className="bg-white text-blue-400 px-5 py-3 rounded-lg cursor-pointer hover:scale-105">Personalize Your Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
