"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

const navItems = [
  { href: "/server", label: "Server" },
  { href: "/client", label: "Client" },
  { href: "/admin", label: "Admin" },
  { href: "/settings", label: "Settings" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white/95 backdrop-blur-xl border border-white/40 flex justify-between items-center px-4 py-3 rounded-2xl w-full max-w-[600px] shadow-2xl">
      <div className="flex items-center gap-x-1.5 sm:gap-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              size="sm"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "rounded-xl transition-all font-medium text-xs sm:text-sm h-8 px-3 sm:px-3.5 border cursor-pointer",
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm hover:bg-slate-800"
                  : "bg-white text-slate-700 border-slate-200 shadow-xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          );
        })}
      </div>
      <UserButton />
    </nav>
  );
};
