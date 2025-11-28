"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            {/* Main Logo */}
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            {/* Active Status Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-lg shadow-green-500/50" />
            {/* Sparkle Effect */}
            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>
          
          <div className="group-hover:translate-x-1 transition-transform duration-300">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              KanbanBoard
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5 font-medium">
              ✨ Productivity Hub
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-11 w-11 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-blue-500 dark:hover:ring-blue-500 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-base">
                      {getInitials(session.user.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2" align="end" sideOffset={12}>
                <DropdownMenuLabel className="p-0">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg mb-2">
                    <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-gray-800">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg">
                        {getInitials(session.user.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-bold leading-none text-gray-900 dark:text-gray-100 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Active Now
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 rounded-lg p-3 font-medium transition-all hover:scale-[0.98]"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}