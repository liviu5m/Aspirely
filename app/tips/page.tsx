"use client";

import CareerData from "@/components/CareerData";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SmallLoader from "@/components/SmallLoader";
import { useAppContext } from "@/lib/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { text } from "stream/consumers";

type Tip = {
  name: string;
  description: string;
};

type CareerType = {
  skills: string[];
  certifications: string[];
  interviewTips: Tip[];
  resumeTips: Tip[];
};

const Courses = () => {
  const [tips, setTips] = useState<CareerType>();
  const { user } = useAppContext();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (user) {
      setInput(user.careerPath);
      setLoading(true);
      axios
        .post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama3-70b-8192",
            messages: [
              {
                role: "user",
                content: `
                CAREER: ${user.careerPath}
  "prompt": "Provide a detailed response in JSON format containing necessary skills, certifications, interview tips, and resume writing tips for a specific job role. Use the following structure:",
  "requestedStructure": {
    "interviewTips": {
      "type": "Tip[]",
      "description": "Array of actionable interview preparation tips",
      "example": {
        "name": "Research the company",
        "description": "Thoroughly investigate the company's mission, values, and recent news before the interview"
      }
    },
    "resumeTips": {
      "type": "Tip[]",
      "description": "Array of professional resume writing recommendations",
      "example": {
        "name": "Quantify achievements",
        "description": "Use numbers and metrics to demonstrate your accomplishments"
      }
    },
    "skills": {
      "type": "string[]",
      "description": "List of hard and soft skills required for the position"
    },
    "certifications": {
      "type": "string[]",
      "description": "List of relevant professional certifications for the role"
    }
  },
  "jobRole": ${user.careerPath},
  "additionalInstructions": [
    "Prioritize tips that are specific to the requested job role",
    "Include both technical and interpersonal skills where applicable",
    "List certifications in order of importance/relevance",
    "Provide practical, actionable advice rather than generic suggestions"
  ]
} SO THE FINAL RESULT SHOULD BE  AN OBJECT:
{
  SKILL,
  CERTIFICATIONS,
  RESUMETIPS,
  INTERVIEWTIPS    
} 

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
          let str = res.data.choices[0].message.content;
          const start = str.indexOf("{");
          const end = str.lastIndexOf("}");

          if (start === -1 || end === -1 || end < start) {
            throw new Error("No valid JSON array found.");
          }

          const jsonArrayStr = str.substring(start, end + 1);
          let jsonStr = jsonArrayStr.replace(
            /"difficulty":\s*(\d+\/\d+)/g,
            `"difficulty": "$1"`
          );
          console.log(jsonStr);

          try {
            let a = JSON.parse(jsonStr);
            setTips(a);
          } catch (err) {
            toast("Something went wrong. Please try again !");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user, update]);

  console.log(tips);

  return (
    <div>
      <div>
        <div className="flex items-center justify-center">
          <div className="text-white container">
            <Header />
            <Sidebar />
            <div className="ml-40 mt-10">
              {loading ? <SmallLoader /> : <CareerData data={tips} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
