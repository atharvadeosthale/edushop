"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import { TRPCReactProvider } from "@/lib/trpc/client";

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
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
