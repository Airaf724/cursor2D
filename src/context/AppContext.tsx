"use client";

import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import toast from "react-hot-toast";

// API Services
export const user_service = "https://user-service-l6rk.onrender.com/api/users";
export const rendering_service = "https://job-producer.onrender.com/api/jobs";
export const chat_service = "https://job-producer.onrender.com/api/jobs";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface IMessage {
  _id?: string;
  prompt: string;
  code: string;
  videoUrl: string | null;
  createdAt: Date;
  isGenerating?: boolean;
}

export interface IChat {
  _id: string;
  user: string;
  title: string;
  messages: IMessage[]; // always treat as array
  createdAt: Date;
  updatedAt: Date;
}

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  isAuth: boolean;
  currentChat: IChat | null;
  chats: IChat[];
  socket: Socket | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  createNewChat: () => Promise<IChat | null>;
  selectChat: (chatId: string) => void;
  sendMessage: (prompt: string) => Promise<void>;
  fetchChats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<IChat[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch current user
  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get<User>(`${user_service}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Socket setup
  const initializeSocket = (userId: string) => {
    if (socketRef.current) return;

    const newSocket = io("https://job-producer.onrender.com", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // ✅ Authenticate and join user room immediately after connection
      newSocket.emit("authenticate", { userId });
      console.log(`🔐 Authenticated with userId: ${userId}`);
    });

    newSocket.on(
      "videoReady",
      ({
        chatId,
        messageId,
        videoUrl,
      }: {
        chatId: string;
        messageId: string;
        videoUrl: string;
      }) => {
        console.log("📹 Video ready received:", {
          chatId,
          messageId,
          videoUrl,
        });

        // Update current chat
        setCurrentChat((prev) => {
          if (prev && prev._id === chatId) {
            const updatedMessages = prev.messages.map((msg) =>
              msg._id === messageId
                ? { ...msg, videoUrl, isGenerating: false }
                : msg
            );
            console.log("✅ Updated current chat messages");
            return { ...prev, messages: updatedMessages };
          }
          return prev;
        });

        // Update chat list
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg._id === messageId
                      ? { ...msg, videoUrl, isGenerating: false }
                      : msg
                  ),
                }
              : chat
          )
        );

        toast.success("🎬 Video is ready!");
      }
    );

    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      toast.error("Connection error occurred");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    // ✅ Handle reconnection
    newSocket.on("reconnect", () => {
      console.log("🔄 Socket reconnected");
      newSocket.emit("authenticate", { userId });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  // Fetch chats
  const fetchChats = async () => {
    if (!user) return;

    try {
      const token = Cookies.get("token");
      const { data } = await axios.get<IChat[]>(`${chat_service}/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Create new chat
  const createNewChat = async (): Promise<IChat | null> => {
    if (!user) return null;

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post<IChat>(
        `${chat_service}/newchat/${user._id}`,
        { title: "New Chat" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats((prev) => [data, ...prev]);
      setCurrentChat(data);
      return data;
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat");
      return null;
    }
  };

  // Select existing chat
  const selectChat = (chatId: string) => {
    const chat = chats.find((c) => c._id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  // Send message
  const sendMessage = async (prompt: string) => {
    let chatToUse = currentChat;

    // If no chat exists, create one
    if (!chatToUse) {
      const newChat = await createNewChat();
      if (!newChat) return;
      chatToUse = newChat;
    }

    try {
      const token = Cookies.get("token");

      // Temporary message
      const tempMessage: IMessage = {
        prompt,
        code: "",
        videoUrl: null,
        createdAt: new Date(),
        isGenerating: true,
      };

      setCurrentChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, tempMessage] } : prev
      );

      // Send request
      const { data } = await axios.post<{ message: IMessage }>(
        `${rendering_service}/script`,
        {
          userId: user?._id,
          chatId: chatToUse._id,
          prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Replace temporary with actual message
      setCurrentChat((prev) => {
        if (!prev) return null;
        const updatedMessages = [...prev.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...data.message,
          isGenerating: true, // still generating video
        };
        return { ...prev, messages: updatedMessages };
      });

      await fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to generate script");

      // Remove temporary message on error
      setCurrentChat((prev) =>
        prev ? { ...prev, messages: prev.messages.slice(0, -1) } : prev
      );
    }
  };

  // Effects
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      initializeSocket(user._id);
      fetchChats();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuth,
        setLoading,
        setIsAuth,
        isLoading,
        currentChat,
        chats,
        socket,
        createNewChat,
        selectChat,
        sendMessage,
        fetchChats,
      }}
    >
      <GoogleOAuthProvider clientId="147050909153-d07pgacmdke10i6td07gknnim74b75p3.apps.googleusercontent.com">
        {children}
        <Toaster position="top-right" />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};
