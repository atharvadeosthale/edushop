"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Link } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
  successMessage?: string;
}

export function CopyButton({
  value,
  className,
  label = "Copy Link",
  successMessage = "Copied to clipboard",
}: CopyButtonProps) {
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopying(true);
      toast.success(successMessage);
      setTimeout(() => setCopying(false), 1500);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={cn(
        "text-black dark:text-white border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10 hover:border-black/30 hover:dark:border-white/30",
        copying &&
          "text-green-600 dark:text-green-400 border-green-600/30 dark:border-green-500/30",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        {copying ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Link className="w-3.5 h-3.5" />
        )}
        {copying ? "Copied!" : label}
      </span>
    </Button>
  );
}
