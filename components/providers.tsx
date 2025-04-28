"use client";

import { authClient } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { ThemeProvider } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";
import { ReactNode } from "react";
import Link from "next/link";

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
