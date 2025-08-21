"use client";
import { useState, useEffect } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import Hero from "@/components/Hero";
import InputBox from "@/components/InputBox";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInterface from "@/components/ChatInterface";
import { useAppData } from "@/context/AppContext";
import { MessageSquare, X } from "lucide-react";

export default function Home() {
  const { user, isLoading, isAuth, currentChat, chats, selectChat } =
    useAppData();
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show chat interface if there's an active conversation
  useEffect(() => {
    if (currentChat?.messages?.length) {
      setShowChat(true);
    }
  }, [currentChat]);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black relative overflow-hidden flex items-center justify-center">
        <BackgroundEffects />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show auth required screen
  if (!isAuth || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black relative overflow-hidden flex items-center justify-center">
        <BackgroundEffects />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Manim AI
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Please log in to start creating animations
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <p className="text-white">Authentication required to continue</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface View
  if (showChat) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black flex relative overflow-hidden">
        <BackgroundEffects />

        {/* Mobile/Desktop Sidebar */}
        <div
          className={`
          fixed md:relative top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
        >
          <ChatSidebar />
        </div>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-white hover:text-blue-400 transition-colors"
                >
                  <MessageSquare className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {currentChat?.title || "Manim Animation Studio"}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    AI-powered mathematical animations
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChat(false);
                  setSidebarOpen(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Back to home"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ChatInterface />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm p-4">
              <div className="max-w-4xl mx-auto">
                <InputBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hero/Landing Page View
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black relative overflow-hidden">
      <BackgroundEffects />
      <Hero />

      <div className="flex flex-col items-center relative z-10">
        <InputBox />

        {/* Show recent chats if any exist */}
        {chats.length > 0 && (
          <div className="mt-8 max-w-2xl w-full px-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Conversations
              </h3>
              <div className="space-y-2">
                {chats.slice(0, 3).map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => {
                      selectChat?.(chat._id); // ✅ fixed: use from context
                      setShowChat(true);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {chat.title || "Untitled Chat"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {chat.messages.length} messages •{" "}
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowChat(true)}
                className="w-full mt-4 text-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                View all conversations →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
