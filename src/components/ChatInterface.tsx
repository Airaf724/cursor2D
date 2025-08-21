"use client";
import React, { useState } from "react";
import {
  Play,
  Download,
  Copy,
  Check as Copied,
  Code,
  Video,
  Loader2,
  User,
  Bot,
} from "lucide-react";
import { useAppData } from "../context/AppContext";

const ChatInterface: React.FC = () => {
  const { currentChat } = useAppData();

  // Track which message was copied
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyScript = (script: string, messageId: string) => {
    navigator.clipboard.writeText(script).then(() => {
      setCopiedId(messageId);

      // Reset back after 30 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 30000);
    });
  };

  const downloadVideo = (videoUrl: string, messageId: string) => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `manim_animation_${messageId}.mp4`;
      a.click();
    }
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Code className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to create animations
            </h3>
            <p className="text-gray-600">
              Describe the mathematical animation you&apos;d like to create and
              I&apos;ll generate the Manim script for you.
            </p>
            <div className="mt-6 text-left bg-gray-100 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Try asking for:</p>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • &quot;Create a circle that transforms into a square&quot;
                </li>
                <li>
                  • &quot;Show a parabola being drawn on a coordinate
                  system&quot;
                </li>
                <li>• &quot;Animate text that changes color and size&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {currentChat?.messages.map((message, index) => (
        <div key={message._id || index} className="space-y-4">
          {/* User Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-gray-800">{message.prompt}</p>
            </div>
          </div>

          {/* Assistant Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              {message.isGenerating && !message.code ? (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating your Manim script...</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-800 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <p className="mb-4">
                    I&apos;ve generated a Manim script for your animation.
                    Here&apos;s the code and preview:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Panel */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-700 text-sm">
                            Manim Script
                          </span>
                        </div>
                        {message.code && (
                          <button
                            onClick={() =>
                              copyScript(message.code, message._id!)
                            }
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copiedId === message._id ? (
                              <>
                                <Copied className="h-3 w-3 text-green-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="p-3">
                        <pre className="text-xs text-gray-800 overflow-x-auto">
                          <code>{message.code}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Video Preview Panel */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-700 text-sm">
                            Animation Preview
                          </span>
                        </div>
                        {message.videoUrl && (
                          <button
                            onClick={() =>
                              downloadVideo(message.videoUrl!, message._id!)
                            }
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 rounded transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </button>
                        )}
                      </div>
                      <div className="p-3">
                        {message.isGenerating ? (
                          <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                              <Loader2 className="h-6 w-6 animate-spin" />
                              <span className="text-xs">
                                Rendering video...
                              </span>
                            </div>
                          </div>
                        ) : message.videoUrl ? (
                          <div className="aspect-video bg-black rounded overflow-hidden">
                            <video
                              controls
                              className="w-full h-full object-contain"
                              preload="metadata"
                            >
                              <source src={message.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <Play className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-xs">Video will appear here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatInterface;
