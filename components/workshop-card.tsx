"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type WorkshopCardProps = {
  id: number;
  name: string;
  description: string;
  time: number;
  price: number;
};

export default function WorkshopCard({
  id,
  name,
  description,
  time,
  price,
}: WorkshopCardProps) {
  const trpc = useTRPC();

  const { mutate: purchaseWorkshop, isPending: isPurchasing } = useMutation(
    trpc.purchaseWorkshop.mutationOptions({
      onSuccess: (url) => {
        if (url) {
          window.location.href = url;
        } else toast.error("Failed to purchase workshop");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-black/[0.07] to-black/[0.03] dark:from-white/[0.07] dark:to-white/[0.03] rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
      <div className="relative h-full p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl hover:border-black/20 hover:dark:border-white/20 transition-all duration-300">
        <div className="h-full flex flex-col">
          <h3 className="text-xl font-medium mb-2">{name}</h3>
          <div className="mt-1 mb-4 h-px w-full bg-gradient-to-r from-black/10 dark:from-white/10 to-transparent"></div>

          <div className="space-y-3 text-black/70 dark:text-white/70 text-sm mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <p className="flex justify-between w-full">
                <span>Date</span>
                <span className="text-black dark:text-white font-medium">
                  {new Date(time * 1000).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="flex justify-between w-full">
                <span>Price</span>
                <span className="text-black dark:text-white font-medium">
                  ${(price / 100).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <p className="text-black/80 dark:text-white/80 mt-auto text-sm leading-relaxed">
            {description}
          </p>

          <button
            className="mt-6 py-2 px-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg text-sm font-medium transition-all duration-200 hover:border-black/20 hover:dark:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => purchaseWorkshop({ id })}
            disabled={isPurchasing}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
