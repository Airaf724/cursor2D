"use client";

import React from "react";
import LoginDialog from "./LoginDIalog"; // 👈 import your dialog
import { useAppData } from "@/context/AppContext";
import Image from "next/image";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { user, isAuth, setLoading, setIsAuth, isLoading } = useAppData();

  const handleLogout = () => {
    setLoading(true);
    Cookies.remove("token");
    setIsAuth(false);
    setLoading(false);
    toast.success("Logout successful!");

    // 🔄 refresh page after logout
    setTimeout(() => {
      window.location.reload();
    }, 100); // small delay so toast shows
  };

  const profileImage =
    user?.picture ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 lg:px-12 bg-gray-900">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-bold text-xl italic cursor-pointer">
          Cursor
        </span>
        <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full">
          2D
        </span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-8 text-gray-300">
        <Link
          href="https://github.com/Airaf724"
          target="_blank"
          className="hover:text-white transition-colors"
        >
          My Github
        </Link>
        <Link
          href="https://www.linkedin.com/in/airaf-lohar-443314251/"
          target="_blank"
          className="hover:text-white transition-colors"
        >
          My Linkedin
        </Link>
        <Link
          href="https://leetcode.com/Airaf"
          target="_blank"
          className="hover:text-white transition-colors"
        >
          My Leetcode
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 cursor-pointer">
        {!isAuth ? (
          <LoginDialog />
        ) : (
          <Button
            onClick={handleLogout}
            className="cursor-pointer" // 👈 makes sure cursor pointer is applied
          >
            Logout
          </Button>
        )}

        <Image
          src={profileImage}
          alt="profile"
          width={32} // better actual px size than 8
          height={32}
          className="w-8 h-8 rounded-full border border-gray-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;
