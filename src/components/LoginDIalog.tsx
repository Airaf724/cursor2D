"use client";

import React, { useState } from "react";
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
  const [open, setOpen] = useState(false); // control dialog state

  const responseGoogle = async (authResult: any) => {
    try {
      const result = await axios.post<LoginResponse>(`${user_service}/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        path: "/",
      });

      toast.success("Login successful!");
      setOpen(false); // close dialog
      setTimeout(() => window.location.reload(), 300); // reload after closing
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      setOpen(false); // close dialog on failure too
      setTimeout(() => window.location.reload(), 300);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
