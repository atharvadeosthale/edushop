"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { UserCircleIcon } from "lucide-react";

export default function DashboardClient() {
  const trpc = useTRPC();
  const { data: stripeConnectionId } = useQuery(
    trpc.getStripeConnection.queryOptions()
  );

  const { data: user } = useQuery(trpc.getUser.queryOptions());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-slate-300">
            Welcome,{" "}
            <span className="text-blue-500">{user?.name?.split(" ")[0]}</span>
          </h1>
          <div className="mt-7 text-slate-400 text-xl max-w-3xl tracking-tight">
            This is the creator dashboard. Here you can create and manage
            workshops. You can also view the purchases made on your platform and
            manage them.
          </div>
        </div>
        <div>
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? ""}
              className="w-52 h-52 rounded-full"
            />
          ) : (
            <div className="w-52 h-52 rounded-full bg-slate-800 flex items-center justify-center">
              <UserCircleIcon className="w-52 h-52 text-slate-300" />
            </div>
          )}
        </div>
      </div>
      {!stripeConnectionId && (
        <div className="mt-7 border border-green-800 rounded-xl p-5 bg-green-900/10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,128,0,0.1)_10px,rgba(0,128,0,0.1)_20px)]">
          <div className="text-slate-400 text-xl tracking-tight">
            <h2 className="text-slate-300 text-2xl font-bold">
              Setup payments using Stripe
            </h2>
            <p className="text-slate-400 mt-4">
              Before you can start selling your workshops, you need to set up
              payments by creating a Stripe account dedicated to Edushop. This
              is where you will receive all your payments and Stripe will
              facilitate with the payouts.
            </p>
          </div>
          <div className="mt-5">
            <Button>Setup payments</Button>
          </div>
        </div>
      )}
    </div>
  );
}
