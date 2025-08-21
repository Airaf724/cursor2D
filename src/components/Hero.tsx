import React from "react";
import { Cloud } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12">
      {/* Banner */}
      <div className="flex justify-center mt-18 mb-16">
        <div className="hidden flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 text-blue-300">
          <Cloud className="w-4 h-4" />
          <span className="text-sm font-medium">Introducing Bolt Cloud!</span>
        </div>
      </div>

      {/* Title + Subtitle */}
      <h1 className="text-4xl md:text-6xl lg:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight">
        What should we build today?
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl">
        Create stunning shapes and videos in Manim Script.
      </p>
    </div>
  );
};

export default Hero;
