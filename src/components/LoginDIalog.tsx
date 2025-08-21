"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

interface LoginResponse {
  token: string;
}

const LoginDialog: React.FC = () => {
  const responseGoogle = async (authResult: any) => {
    try {
      const result = await axios.post<LoginResponse>(`${user_service}/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        // secure: true,
        path: "/",
      });

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Sign in
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={() => googleLogin()}
            variant="outline"
            className="flex items-center gap-2 justify-center w-full"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
