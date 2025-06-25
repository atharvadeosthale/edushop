"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Calendar, DollarSign } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseWorkshopId: string;
}

export default function SuccessDialog({
  isOpen,
  onClose,
  purchaseWorkshopId,
}: SuccessDialogProps) {
  const trpc = useTRPC();

  const { data: workshop, isLoading } = useQuery({
    ...trpc.getWorkshopById.queryOptions({
      id: parseInt(purchaseWorkshopId),
    }),
    enabled: isOpen && !!purchaseWorkshopId,
  });

  const workshopLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/workshop/${purchaseWorkshopId}`
      : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Purchase Successful!
          </DialogTitle>
          <DialogDescription className="text-center">
            Congratulations! You have successfully purchased the workshop.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse w-1/2"></div>
          </div>
        ) : workshop ? (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-lg">
              <h3 className="font-medium text-lg mb-2">{workshop.name}</h3>
              <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                {workshop.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-black/60 dark:text-white/60">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(workshop.time * 1000).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-black/60 dark:text-white/60">
                  <DollarSign className="h-4 w-4" />
                  <span>${(workshop.price / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-black/70 dark:text-white/70 mb-3">
                Access your workshop using the link below:
              </p>
              <div className="flex justify-center">
                <CopyButton
                  value={workshopLink}
                  label="Copy Workshop Link"
                  successMessage="Workshop link copied!"
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-black/60 dark:text-white/60">
            Workshop details not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
