"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/lib/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { text } from "stream/consumers";

const Courses = () => {
  const [courses, setCourses] = useState();
  const { user } = useAppContext();
  const [input, setInput] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (user) {
      setInput(user.careerPath);
      axios
        .get("/api/courses")
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response?.data || err.message);
        });
    }
  }, [user, update]);

  return (
    <div>
      <div>
        <div className="flex items-center justify-center">
          <div className="text-white container">
            <Header />
            <Sidebar />
            <div className="ml-40 mt-10">
              <div className="flex items-center justify-center gap-10">
                <input
                  type="text"
                  className="w-full px-5 outline-none py-3 rounded-lg bg-blue-400"
                  placeholder="Courses"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="text-blue-400 bg-white px-5 py-3 rounded-lg cursor-pointer"
                  onClick={() => setUpdate(!update)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
