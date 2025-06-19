"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";

type Certificate = {
  name: string;
  year: string;
};

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
};

const Account = () => {
  const { data: session } = useSession();

  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentExperience, setCurrentExperience] = useState("");
  const [currentCertificate, setCurrentCertificate] = useState<Certificate>({
    name: "",
    year: "undefined",
  });
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [personality, setPersonality] = useState("");
  const { user } = useAppContext();

  const updateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .put("/api/user", {
        name,
        username,
        age,
        education,
        city,
        country,
        personality,
        interests: interests.join("<interest>"),
        skills: skills.join("<skill>"),
        experiences: experiences.join("<experience>"),
        certificates: certificates
          .map((el) => el.name + "<year>" + el.year)
          .join("<certificate>"),
        id: user?.id || -1,
      })
      .then((res) => {
        console.log(res.data);
        toast("Account Updated successfully !");
        localStorage.removeItem("careers");
      })
      .catch((err) => {
        console.log(err);
        toast("Something went wrong !");
      });
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setAge(user.age);
      setEducation(user.education);
      setCity(user.city);
      setCountry(user.country);
      setPersonality(user.personality);
      setInterests(user.interests.split("<interest>"));
      setSkills(user.skills.split("<skill>"));
      setExperiences(user.experiences.split("<experience>"));
      setCertificates(
        user.certificates.split("<certificate>").map((el: string) => {
          let data = el.split("<year>");
          return {
            name: data[0],
            year: data[1],
          };
        })
      );
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center p-10 text-white">
      <div className="container">
        <h1 className="text-blue-400 text-4xl text-center font-semibold mb-10">
          Profile
        </h1>
        <form
          className="flex items-center justify-center flex-col gap-10"
          onSubmit={(e) => updateUser(e)}
        >
          <div className="flex gap-10">
            <div className="flex flex-col gap-5 w-1/2">
              <input
                type="text"
                placeholder="Name"
                className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
              <input
                type="text"
                placeholder="Username"
                className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
              <input
                type="number"
                placeholder="Age"
                className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
              <input
                type="text"
                placeholder="Education"
                className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
              <div className="flex gap-5 items-center justify-between">
                <input
                  type="text"
                  placeholder="City"
                  className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="px-5 py-3 rounded-lg bg-blue-400 outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              </div>
              <textarea
                placeholder="Describe your personality"
                className="px-5 py-3 rounded-lg bg-blue-400 h-24 outline-none resize-none"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              ></textarea>
            </div>
            <div className="flex flex-col gap-5 w-1/2">
              <div>
                <h2 className="text-lg mb-5">Interests</h2>
                <div className="flex items-center justify-center gap-5">
                  <input
                    type="text"
                    placeholder="Interest"
                    className="px-5 py-3 w-full rounded-lg bg-blue-400 outline-none"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <button
                    type="button"
                    className="px-8 py-3 rounded-lg bg-green-600 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentInterest.trim())
                        setInterests([...interests, currentInterest]);
                      setCurrentInterest("");
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex mt-5 gap-5 flex-wrap">
                  {interests.map((el, i) => {
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-lg bg-gray-400/50 flex items-center justify-center gap-3"
                      >
                        <span>{el}</span>
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-sm text-red-500 cursor-pointer p-1"
                          onClick={() => {
                            setInterests(
                              interests.filter((int, ind) => ind != i)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-lg mb-5">Strengths/Skills</h2>
                <div className="flex items-center justify-center gap-5">
                  <input
                    type="text"
                    placeholder="Strengths/Skills"
                    className="px-5 py-3 w-full rounded-lg bg-blue-400 outline-none"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <button
                    type="button"
                    className="px-8 py-3 rounded-lg bg-green-600 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentSkill.trim())
                        setSkills([...skills, currentSkill]);
                      setCurrentSkill("");
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex mt-5 gap-5 flex-wrap">
                  {skills.map((el, i) => {
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-lg bg-gray-400/50 flex items-center justify-center gap-3"
                      >
                        <span>{el}</span>
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-sm text-red-500 cursor-pointer p-1"
                          onClick={() => {
                            setSkills(skills.filter((int, ind) => ind != i));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-lg mb-5">Experiences</h2>
                <div className="flex items-center justify-center gap-5">
                  <input
                    type="text"
                    placeholder="Experience"
                    className="px-5 py-3 w-full rounded-lg bg-blue-400 outline-none"
                    value={currentExperience}
                    onChange={(e) => setCurrentExperience(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <button
                    type="button"
                    className="px-8 py-3 rounded-lg bg-green-600 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentExperience.trim())
                        setExperiences([...experiences, currentExperience]);
                      setCurrentExperience("");
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex mt-5 gap-5 flex-wrap">
                  {experiences.map((el, i) => {
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-lg bg-gray-400/50 flex items-center justify-center gap-3"
                      >
                        <span>{el}</span>
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-sm text-red-500 cursor-pointer p-1"
                          onClick={() => {
                            setExperiences(
                              experiences.filter((int, ind) => ind != i)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-lg mb-5">Certificates</h2>
                <div className="flex items-center justify-center gap-5">
                  <input
                    type="text"
                    placeholder="Certificate Name"
                    className="px-5 py-3 w-full rounded-lg bg-blue-400 outline-none"
                    value={currentCertificate.name}
                    onChange={(e) =>
                      setCurrentCertificate({
                        ...currentCertificate,
                        name: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Certificate Year"
                    className="px-5 py-3 w-full rounded-lg bg-blue-400 outline-none"
                    value={currentCertificate.year}
                    onChange={(e) =>
                      setCurrentCertificate({
                        ...currentCertificate,
                        year: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <button
                    type="button"
                    className="px-8 py-3 rounded-lg bg-green-600 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        currentCertificate.name.trim() &&
                        currentCertificate.year.trim()
                      )
                        setCertificates([...certificates, currentCertificate]);
                      setCurrentCertificate({
                        name: "",
                        year: "undefined",
                      });
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex mt-5 gap-5 flex-wrap">
                  {certificates.map((el, i) => {
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-lg bg-gray-400/50 flex items-center justify-center gap-3"
                      >
                        <span>
                          {el.name} ({el.year})
                        </span>
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-sm text-red-500 cursor-pointer p-1"
                          onClick={() => {
                            setCertificates(
                              certificates.filter((int, ind) => ind != i)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button className="px-20 py-3 rounded-lg bg-blue-400 hover:scale-110 cursor-pointer">
            Save
          </button>
        </form>
      </div>
      <div className="absolute top-10 left-10">
        <Link className="flex gap-3 items-center justify-center p-1" href={"/"}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Account;
