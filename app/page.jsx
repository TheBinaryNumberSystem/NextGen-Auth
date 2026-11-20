import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { ShieldCheck, Sparkles, KeyRound, Database, Users } from "lucide-react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Home() {
  return (
    <main className="auth-gradient-bg flex min-h-screen flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-white/15 transition-colors">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>NextGen Full-Stack Authentication</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1
            className={cn(
              "text-5xl sm:text-7xl font-extrabold tracking-tight drop-shadow-md",
              font.className
            )}
          >
            🔐 Auth.js
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-lg mx-auto font-normal leading-relaxed">
            A production-ready, secure authentication service with OAuth, Email 2FA, and Neon Serverless Postgres.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <LoginButton asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl"
            >
              Sign In
            </Button>
          </LoginButton>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-white/10 text-white hover:bg-white/20 border-white/30 backdrop-blur-md transition-all duration-200 rounded-xl"
          >
            <Link href="/auth/register">Create Account</Link>
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
            <KeyRound className="h-5 w-5 text-sky-300" />
            <p className="font-semibold text-xs sm:text-sm text-white">OAuth Login</p>
            <p className="text-xs text-white/70">Google & GitHub</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <p className="font-semibold text-xs sm:text-sm text-white">2FA OTP</p>
            <p className="text-xs text-white/70">Email verification</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
            <Database className="h-5 w-5 text-indigo-300" />
            <p className="font-semibold text-xs sm:text-sm text-white">Neon DB</p>
            <p className="text-xs text-white/70">Serverless Postgres</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
            <Users className="h-5 w-5 text-purple-300" />
            <p className="font-semibold text-xs sm:text-sm text-white">Role Access</p>
            <p className="text-xs text-white/70">Admin & User guards</p>
          </div>
        </div>
      </div>
    </main>
  );
}
