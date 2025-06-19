"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SmallLoader from "@/components/SmallLoader";
import CareerTable from "@/components/CareerTable";
import { useAppContext } from "@/lib/AppContext";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  age: number;
  education: string;
  city: string;
  country: string;
  personality: string;
  interests: string;
  skills: string;
  experiences: string;
  certificates: string;
  careerPath: string;
};

type Career = {
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  recommendedCertificates: string[];
  estimatedSalaryRange: string;
  difficulty: string;
};

const Path = () => {
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [careerPath, setCareerPath] = useState("");
  const { user, setUser } = useAppContext();

  useEffect(() => {
    if (localStorage.getItem("careers")) {
      setCareers(JSON.parse(localStorage.getItem("careers") || ""));
    }
    if (user) {
      setCareerPath(user.careerPath);
    }
  }, [user]);

  const getCareerPaths = () => {
    if (user) {
      setCareers([]);
      setLoading(true);
      axios
        .post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama3-70b-8192",
            messages: [
              {
                role: "user",
                content: `You are a professional career advisor AI.

You will receive user data with detailed personal and professional information.

Your task is to analyze this data and generate exactly 10 career recommendations fully customized to the user.

Return only valid JSON output.

Do not write any comments, markdown, explanations, introductions, or notes — only output the JSON array as described below.

Each object in the array must follow this format:

{
  "jobTitle": "text",
  "description": "text",
  "requiredSkills": [skill_name, skill_name...],
  "recommendedCertificates": [...certificate_name, certificate_name...],
  "estimatedSalaryRange": "xxxxx-xxxxx USD annually",
  "difficulty": "x/5",
}
  
Rules:

- Fully populate every field. None should be empty.
- Use at least 5 highly specific, real-world skills in "requiredSkills".
- Use at least 4 real, widely recognized certificates in "recommendedCertificates".
- For "estimatedSalaryRange": always write annual salary in USD, e.g. "75000-90000 USD annually".
- For "difficulty": always write in the format "x/5".
- DO NOT include any years, dates, or timestamps inside "requiredSkills" or "recommendedCertificates" arrays.
- DO NOT include any control characters such as tabs (\t), newlines (\n), or any other special escape sequences inside the JSON.
- DO NOT write phrases like "x more objects", "similar objects", "etc.", or "...". Write all 10 objects fully.
- DO NOT summarize, abbreviate, or omit any entries.
- DO NOT write anything outside the pure JSON array.
- Output must be strict valid JSON that can be parsed programmatically.
- Each object should have unique and realistic content.


User input data:

{
  "skills": ${user?.skills},
  "experience": ${user?.experiences},
  "interests": ${user?.interests},
  "education": ${user?.education},
  "city": ${user?.city},
  "country": ${user?.country},
  "certificates": ${user?.certificates},
  "personality": ${user?.personality}
}
DO NOT WRITE ANYTHING ELSE BESIDES THE JSON
PLEASE FINISH THE JSON AND WRITE IT TO BE VALID
🔎 Global issues to avoid:
1️⃣ Missing some commas
2️⃣ Extra commas (trailing commas)
3️⃣ Mixed use of single quotes ' and double quotes " inside arrays
4️⃣ Some mismatched quotes inside strings

DONT Write anything that is not necessary
`,
              },
            ],
          },
          {
            headers: {
              Authorization: "Bearer " + process.env.NEXT_PUBLIC_GROQ_KEY,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);

          // let str = res.data.response;
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
          console.log(jsonStr);

          const data = JSON.parse(jsonStr);
          localStorage.setItem("careers", JSON.stringify(data));
          setCareers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="text-white container">
        <Header />
        <Sidebar />

        <div className="mt-5 ml-40">
          <div>
            <div className="flex items-center justify-between ">
              <Link
                href={"/account"}
                className="px-10 py-4 rounded-lg bg-blue-400"
              >
                Customize Profile Data
              </Link>
              <h1 className="text-xl">
                {careerPath ? (
                  <>
                    Career Path:{" "}
                    <span className="text-blue-400">{careerPath}</span>
                  </>
                ) : (
                  "Choose A Career Path"
                )}
              </h1>
            </div>
            {loading && (
              <h2 className="text-gray-400 my-3 text-center">
                It may take a while (∼ 1 min)
              </h2>
            )}
            <div className="flex items-center justify-center gap-10 mt-20">
              <h1 className="text-center text-2xl">
                Get Your Customized Career Path
              </h1>
              <button
                className="px-5 py-3 cursor-pointer rounded-lg bg-blue-400 outline-none"
                onClick={() => getCareerPaths()}
              >
                Generate
              </button>
            </div>
          </div>
          <div>{loading && <SmallLoader />}</div>
          <div>
            {careers.length != 0 && (
              <CareerTable
                careers={careers}
                setCareerPath={setCareerPath}
                careerPath={careerPath}
                userId={user?.id || ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Path;
