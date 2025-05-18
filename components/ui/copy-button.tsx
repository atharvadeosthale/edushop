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
        "text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30",
        copying && "text-green-400 border-green-500/30",
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
