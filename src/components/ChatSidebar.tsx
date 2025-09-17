"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Calendar,
  FilePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAppData } from "../context/AppContext";

const ChatSidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat } = useAppData();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={createNewChat}
          className="w-full flex items-center gap-3 px-4 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <FilePlus className="h-5 w-5" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onMouseEnter={() => setHoveredChat(chat._id)}
                onMouseLeave={() => setHoveredChat(null)}
                className={`flex items-center justify-between rounded-lg transition-colors ${
                  currentChat?._id === chat._id
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <button
                  onClick={() => selectChat(chat._id)}
                  className="flex-1 flex items-center gap-3 p-3 text-left"
                >
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {chat.title || "Untitled Chat"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        {formatDate(chat.updatedAt)}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Edit + Delete buttons (show only on hover) */}
                {hoveredChat === chat._id && (
                  <div className="flex items-center gap-2 pr-2">
                    <button className="p-1 rounded hover:bg-gray-600 transition">
                      <Pencil className="h-4 w-4 text-gray-300" />
                    </button>
                    <button className="p-1 rounded hover:bg-red-600 transition">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
