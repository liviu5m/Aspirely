"use client";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import SmallLoader from "@/components/SmallLoader";
import { useAppContext } from "@/lib/AppContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

type skill = {
  step: string;
  description: string;
  achieved: boolean;
};

const Roadmap = () => {
  const { user } = useAppContext();
  const [roadmap, setRoadmap] = useState<skill[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    axios
      .post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: `Give me a roadmap and skills gaps for a ${user.careerPath}, my skills begin ${user.skills} and my certificates being ${user.certificates}  return JSON form 
                dont categorize by year put everything in order I have to learn and if I've that from skills or certificates you should add a field achieved: 1(for done), 0 (for not done) at least 10 steps and add for achieved (since you have this...) please return only json not anything else THESE SKILLS SHOULD BE BASED ON THE CAREER PATH I CHOOSED IF I HAVE MORE SKILLS IN OTHER AREAS THEY SHOULDN'T LIKE BE COUNT FOR MY SPECIFIC CAREER PATH CHOOSEN, AND ADD ALONGISDE {step (step_name), description (a description about what should i do), achieved}
                ALSO IF MY SKILLS HAVE NO CORRELANCE WITH THE CAREER PATH YOU SHOUDN'T INCLUDE THEM FOR EXAMPLE DRAWING IN SOFTWARE ENGINEERING
                DONT ADD ANY COMMENTS DO NOT MENTION ANYTHIGN BESIDES THE JSON
                PLEASE GIVE THE STEPS IN ROW TO MAKE SENSE
                IN THE TERM OF ACHIEVED ITEM DECIDE YOUSELF DON'T PUT ANY CONDITION DECIDE YOURSELF`,
            },
          ],
        },
        {
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        let str = res.data.choices[0].message.content;
        const start = str.indexOf("[");
        const end = str.lastIndexOf("]");

        if (start === -1 || end === -1 || end < start) {
          throw new Error("No valid JSON array found.");
        }

        const jsonArrayStr = str.substring(start, end + 1);

        let jsonStr = jsonArrayStr.replace(
          /"difficulty":\s*(\d+\/\d+)/g,
          `"difficulty": "$1"`
        );
        try {
          let a = JSON.parse(jsonStr);
          setRoadmap(a);
        } catch (err) {
          toast("Something went wrong. Please try again !");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (roadmap && user) {
      axios
        .put("/api/user", {
          id: user.id,
          roadmap: JSON.stringify(roadmap),
          type: "roadmap",
        })
        .then((res) => {
          console.log(res.data);
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [roadmap]);

  useEffect(() => {
    if (user && roadmap) {
      setRoadmap(JSON.parse(user.roadmap));
    }
  }, [user]);

  return !user ? (
    <Loader />
  ) : (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-white container">
          <Header />
          <Sidebar />
          <div className="ml-40 mt-10">
            <div className="flex items-center justify-center gap-10">
              <h1 className="text-center text-xl">
                Get your fully customizable roadmap career{" "}
                <span className="text-blue-400">{user.careerPath}</span>
              </h1>
              <button
                className="px-5 py-3 rounded-lg bg-blue-400 hover:text-blue-400 hover:bg-white cursor-pointer outline-none"
                onClick={() => generate()}
              >
                Generate
              </button>
            </div>
            {loading ? (
              <SmallLoader />
            ) : (
              roadmap.length > 0 && (
                <table className="w-full table-auto border-collapse text-left my-10">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                      <th className="p-4">Step</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {roadmap.map((item, index) => (
                      <tr
                        key={index}
                        className="even:bg-gray-200 bg-blue-50 transition"
                      >
                        <td className="p-4 font-semibold">{item.step}</td>
                        <td className="p-4">{item.description}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.achieved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.achieved ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            className={`px-3 cursor-pointer py-1 rounded-md ${
                              item.achieved
                                ? "bg-blue-200 text-gray-600 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                            onClick={() => {
                              setRoadmap(
                                roadmap.map((r, i) => {
                                  if (i == index)
                                    return { ...r, achieved: !r.achieved };
                                  else return r;
                                })
                              );
                            }}
                          >
                            {item.achieved ? "Done" : "Mark Complete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Roadmap;
