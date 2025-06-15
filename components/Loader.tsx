import React from "react";

const Loader = () => {
  return (
    <div className="fixed z-50 w-screen h-full top-0 left-0 bg-[#202020]">
      <div className="loader">
        <div className="justify-content-center jimu-primary-loading"></div>
      </div>
    </div>
  );
};

export default Loader;
