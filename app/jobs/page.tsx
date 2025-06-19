"use client";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/lib/AppContext";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type AdzunaJob = {
  id: string;
  title: string;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_is_predicted: boolean;
  contract_time: string;
  redirect_url: string;
  company: {
    display_name: string;
  };
  location: {
    area: string[];
    display_name: string;
  };
  created: string;
  category: {
    label: string;
    tag: string;
  };
};

const Jobs = () => {
  const [jobs, setJobs] = useState<AdzunaJob[]>();
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .post("/api/adzuna", {
          careerPath: user.careerPath,
        })
        .then((res) => {
          console.log(res.data.results);

          setJobs(res.data.results);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user]);

  return loading ? (
    <Loader />
  ) : (
    jobs && (
      <div>
        <div className="flex items-center justify-center">
          <div className="text-white container">
            <Header />
            <Sidebar />
            <div className="ml-40">
              <table className="w-full table-auto border-separate border-spacing-y-2 rounded-lg my-10 shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                    <th className="p-3 text-sm font-semibold">Job Title</th>
                    <th className="p-3 text-sm font-semibold">Company</th>
                    <th className="p-3 text-sm font-semibold">Location</th>
                    <th className="p-3 text-sm font-semibold">Description</th>
                    <th className="p-3 text-sm font-semibold">Contract</th>
                    <th className="p-3 text-sm font-semibold">Salary Range</th>
                    <th className="p-3 text-sm font-semibold">Posted Date</th>
                    <th className="p-3 text-sm font-semibold">
                      Access The Job
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {jobs.map((job) => {

                    const postedDate = new Date(job.created).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    );

                    let contract = "Not Specified";
                    if (job.contract_time)
                      contract = job.contract_time
                        .split(/[_\s]+/)
                        .map(
                          (word) =>
                            word[0].toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(" ");

                    return (
                      <tr
                        key={job.id}
                        className="bg-white even:bg-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-md"
                      >
                        <td className="p-3 font-semibold text-sm min-w-[160px] whitespace-normal">
                          {job.title}
                        </td>
                        <td className="p-3 text-xs min-w-[140px] whitespace-normal">
                          {job.company.display_name}
                        </td>
                        <td className="p-3 text-xs min-w-[140px] whitespace-normal">
                          {job.location.display_name}
                        </td>
                        <td className="p-3 text-xs min-w-[300px] whitespace-normal">
                          {job.description}
                        </td>
                        <td className="p-3 text-xs min-w-[120px] whitespace-normal">
                          {contract}
                        </td>
                        <td className="p-3 font-semibold text-purple-700 text-sm min-w-[140px] whitespace-normal">
                          £{job.salary_max}
                        </td>
                        <td className="p-3 text-xs min-w-[120px] whitespace-normal">
                          {postedDate}
                        </td>
                        <td className="p-3 text-xs min-w-[100px] whitespace-normal">
                          <a
                            href={job.redirect_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md bg-blue-400 text-white font-semibold"
                          >
                            Apply
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Jobs;
