"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const callbackUrl = searchParams.get("callbackUrl");
  const isRegister = pathname === "/auth/register";

  const onClick = (provider) => {
    // Flag whether the flow originated from sign-up or login
    document.cookie = `auth_flow=${isRegister ? "register" : "login"}; path=/; max-age=300; SameSite=Lax`;

    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-3">
      <Button
        size="lg"
        className="w-full flex-1 h-11 rounded-xl hover:bg-slate-50 transition-all border-slate-200 shadow-sm hover:shadow cursor-pointer"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-full flex-1 h-11 rounded-xl hover:bg-slate-50 transition-all border-slate-200 shadow-sm hover:shadow cursor-pointer"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
