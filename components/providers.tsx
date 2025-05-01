"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
