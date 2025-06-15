"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    if (session?.user)
      axios
        .get("/api/user/" + session?.user?.email)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [session?.user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
