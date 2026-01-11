"use client";

import { Zap, Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-black px-4 md:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1" />
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <Button
          variant="outline"
          className="h-10 gap-2 border-white/10 bg-zinc-900/50 px-2 md:px-4 text-xs md:text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span className="hidden sm:inline">120 Credits</span>
          <span className="sm:hidden">120</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-zinc-400 hover:bg-zinc-900 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-zinc-500" />
        </Button>

        <div className="hidden sm:block h-8 w-px bg-white/10" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 md:gap-3 outline-none">
              <Avatar className="h-8 w-8 md:h-10 md:h-10 border border-white/10">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start text-sm">
                <span className="font-semibold text-white leading-none">Alex Morgan</span>
                <span className="text-xs text-zinc-500">Pro Plan</span>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-white/10 bg-zinc-950 text-white">
            <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900">Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:bg-zinc-900 focus:bg-zinc-900">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
