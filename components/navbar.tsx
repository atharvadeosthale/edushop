"use client";

import Link from "next/link";
import { ThemeToggler } from "./theme-toggler";
import { Button } from "./ui/button";
import { BookOpen, Github, UserIcon } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const trpc = useTRPC();

  const queryOptions = trpc.getUser.queryOptions();

  queryOptions.retry = false;

  const { data: user, isLoading: isUserLoading } = useQuery(queryOptions);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-md group-hover:bg-blue-700 transition-colors">
            <BookOpen size={20} />
          </div>
          <h1 className="text-2xl font-bold">Edushop</h1>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
            {isUserLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
            ) : user ? (
              user.image ? (
                <img
                  src={user.image}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                  onClick={handleSignOut}
                />
              ) : (
                <UserIcon className="w-10 h-10" onClick={handleSignOut} />
              )
            ) : (
              <Link href="/auth">
                <Button variant="outline">Sign in</Button>
              </Link>
            )}
            {/* <UserButton size="full" /> */}
          </div>
          <Link
            href="https://github.com/atharvadeosthale/edushop"
            target="_blank"
          >
            <Button className="hidden sm:flex gap-2 items-center">
              <Github size={18} />
              GitHub
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
}
