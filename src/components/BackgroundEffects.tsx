import React from "react";

const BackgroundEffects: React.FC = () => {
  return (
    <>
      {/* Orb effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 w-full h-full">
          <div className="w-full h-full rounded-full bg-gradient-to-t from-blue-500/20 via-cyan-400/10 to-transparent blur-3xl animate-pulse"></div>
        </div>
        {/* <div className="absolute -bottom-1/4 left-1/2 transform -translate-x-1/2 w-[200%] h-96 rounded-full border-t-2 border-blue-400/30 bg-gradient-to-t from-slate-900 to-transparent"></div> */}
      </div>

      {/* Floating dots */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
      <div
        className="absolute top-1/3 right-16 w-1 h-1 bg-cyan-400/50 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-20 w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-10 w-2 h-2 bg-cyan-300/50 rounded-full animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </>
  );
};

export default BackgroundEffects;
