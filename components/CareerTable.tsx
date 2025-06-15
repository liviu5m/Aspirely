import { useAppContext } from "@/lib/AppContext";
import axios from "axios";
import React from "react";

type Career = {
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  recommendedCertificates: string[];
  estimatedSalaryRange: string;
  difficulty: string;
};

const CareerTable = ({
  careers,
  setCareerPath,
  careerPath,
  userId,
}: {
  careers: Career[];
  setCareerPath: (e: string) => void;
  careerPath: string;
  userId: string;
}) => {
  const { user, setUser } = useAppContext();

  const changeCareerPath = (career: string) => {
    setCareerPath(career);
    axios
      .put("/api/user", {
        career,
        type: "careerPathUpdate",
        roadmap: "",
        id: userId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <table className="w-full table-auto border-collapse text-left my-10">
      <thead>
        <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <th className="p-4">Job Title</th>
          <th className="p-4">Description</th>
          <th className="p-4">Required Skills</th>
          <th className="p-4">Certifications</th>
          <th className="p-4">Salary Range</th>
          <th className="p-4">Difficulty</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {careers.map((career, i) => {
          let dif = "";
          for (let i = 0; i < Number(career.difficulty[0]); i++) dif += "★";
          for (let i = 0; i < 5 - Number(career.difficulty[0]); i++) dif += "☆";
          return (
            <tr key={i} className="even:bg-gray-200 bg-blue-50 transition">
              <td className="p-4 font-semibold">{career.jobTitle}</td>
              <td className="p-4">{career.description}</td>
              <td className="p-4">{career.requiredSkills.join(", ")}</td>
              <td className="p-4">
                {career.recommendedCertificates.join(", ")}
              </td>
              <td className="p-4 font-bold text-blue-500">
                {career.estimatedSalaryRange}
              </td>
              <td className="p-4 text-yellow-400 text-xl">{dif}</td>
              <td className="p-4">
                <button
                  className={`px-3 py-1 rounded-md cursor-pointer ${
                    careerPath == career.jobTitle
                      ? "bg-white text-blue-400"
                      : "bg-blue-400 text-white"
                  }`}
                  onClick={() => {
                    changeCareerPath(career.jobTitle);
                    setUser({ ...user, careerPath: career.jobTitle });
                  }}
                >
                  {careerPath == career.jobTitle ? "Selected" : "Select"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CareerTable;
