"use client";
import React, { useState, ChangeEvent } from "react";
import { Paperclip, Sparkles, ArrowUp } from "lucide-react";
import { useAppData } from "../context/AppContext";

const InputBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const { user, sendMessage, currentChat, createNewChat } = useAppData();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleRequest = async () => {
    if (!inputValue.trim() || !user) return;

    const prompt = inputValue;
    setInputValue(""); // Clear input immediately

    try {
      await sendMessage(prompt);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRequest();
    }
  };

  return (
    <div className="w-full max-w-2xl mb-8 relative z-10">
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Describe the animation you want to create..."
          className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          rows={3}
        />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
          <button
            disabled={!inputValue.trim()}
            onClick={handleRequest}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-7 h-7 text-blue-500 cursor-pointer hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
