import React from "react";

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

const CareerData = ({ data }: { data: CareerType | undefined }) => {
  return (
    data && (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Career Preparation Guide
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Essential Skills
            </h2>
            <ul className="space-y-2 text-gray-700">
              {data.skills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Recommended Certifications
            </h2>
            <ul className="space-y-2 text-gray-700">
              {data.certifications.map((cert, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              Interview Tips
            </h2>
            <div className="space-y-4">
              {data.interviewTips.map((tip, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2 text-gray-800">{tip.name}</h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">
              Resume Tips
            </h2>
            <div className="space-y-4">
              {data.resumeTips.map((tip, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2 text-gray-800">{tip.name}</h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CareerData;
