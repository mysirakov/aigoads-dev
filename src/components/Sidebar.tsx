"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Settings, Clapperboard, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-black text-white relative">
      {/* Mobile Close Button */}
      {onMobileClose && (
        <button 
          onClick={onMobileClose}
          className="absolute right-4 top-6 md:hidden text-zinc-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Logo Section */}
      <div className={cn(
        "flex h-20 items-center gap-3 px-6",
        isCollapsed && "justify-center px-0"
      )}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black">
          <Clapperboard className="h-6 w-6" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight">AIGOAds</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3 text-sm font-medium"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle Button (Desktop only) */}
      <div className="hidden md:block p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-full h-10 border border-white/5 bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all rounded-xl"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
        </Button>
      </div>

      {/* Plan Usage Section */}
      <div className="p-4">
        <div className={cn(
          "rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition-all",
          isCollapsed && "p-2 flex flex-col items-center"
        )}>
          {!isCollapsed ? (
            <>
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-400">Plan Usage</span>
                <span className="text-white">24%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800">
                <div className="h-full w-[24%] rounded-full bg-zinc-500" />
              </div>
              <p className="mt-3 text-[10px] text-zinc-500">Next reset in 12 days</p>
            </>
          ) : (
            <div className="text-[10px] font-bold text-white">24%</div>
          )}
        </div>
      </div>
    </div>
  );
}
