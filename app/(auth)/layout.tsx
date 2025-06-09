import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await auth();

  if (session?.user) redirect("/");

  return (
    <SessionProvider>
      <div className="w-screen overflow-hidden h-screen bg-[#202020] flex items-center justify-center">
        {children}
      </div>
    </SessionProvider>
  );
};

export default AuthLayout;
