import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="text-white fixed left-10 h-full">
      <div className="flex items-start justify-center h-full px-10 py-40">
        <ul className="flex flex-col gap-8">
          <Link
            href={"/path"}
            className={`${
              pathname == "/path"
                ? "text-blue-500 bg-white scale-105 shadow-lg shadow-blue-500"
                : "bg-blue-400 hover:scale-105 hover:shadow-md hover:shadow-blue-500"
            } px-5 py-3 rounded-lg cursor-pointer font-semibold`}
          >
            Find My Career Path
          </Link>
          <Link
            href={"/roadmap"}
            className={`${
              pathname == "/roadmap"
                ? "text-blue-500 bg-white scale-105 shadow-lg shadow-blue-500"
                : "bg-blue-400 hover:scale-105 hover:shadow-md hover:shadow-blue-500"
            } px-5 py-3 rounded-lg cursor-pointer font-semibold`}
          >
            Roadmap
          </Link>
          <Link
            href={"/tips"}
            className={`${
              pathname == "/tips"
                ? "text-blue-500 bg-white scale-105 shadow-lg shadow-blue-500"
                : "bg-blue-400 hover:scale-105 hover:shadow-md hover:shadow-blue-500"
            } px-5 py-3 rounded-lg cursor-pointer font-semibold`}
          >
            Tips
          </Link>
          <Link
            href={"/jobs"}
            className={`${
              pathname == "/jobs"
                ? "text-blue-500 bg-white scale-105 shadow-lg shadow-blue-500"
                : "bg-blue-400 hover:scale-105 hover:shadow-md hover:shadow-blue-500"
            } px-5 py-3 rounded-lg cursor-pointer font-semibold`}
          >
            Find Jobs
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
