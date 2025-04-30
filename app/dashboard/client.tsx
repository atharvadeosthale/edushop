"use client";

import CreateWorkshop from "@/components/dashboard/create-workshop";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableHeader,
} from "@/components/ui/table";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, UserCircleIcon, UserRoundSearch } from "lucide-react";

export default function DashboardClient() {
  const trpc = useTRPC();
  const { data: stripeConnectionId } = useQuery(
    trpc.getStripeConnection.queryOptions()
  );

  const { data: user } = useQuery(trpc.getUser.queryOptions());

  const { data: workshops, isLoading: isWorkshopsLoading } = useQuery(
    trpc.getWorkshops.queryOptions()
  );

  const {
    mutate: createStripeConnection,
    isPending: isStripeConnectionLoading,
  } = useMutation(
    trpc.createStripeConnection.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
      },
    })
  );

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
              alt={user.name ?? "User profile picture"}
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
            <Button onClick={() => createStripeConnection()}>
              {isStripeConnectionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Setup payments"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-300 text-4xl font-bold tracking-tighter">
            Your workshops
          </h2>
          {/* <Button className="text-base">Create workshop</Button> */}
          <CreateWorkshop />
        </div>

        {isWorkshopsLoading ? (
          <div className="mt-10">
            <div className="rounded-lg border border-gray-800">
              {/* Header */}
              <div className="border-b border-gray-800">
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div className="h-6 w-20 rounded bg-gray-800 animate-pulse"></div>
                  <div className="h-6 w-32 rounded bg-gray-800 animate-pulse"></div>
                  <div className="h-6 w-16 rounded bg-gray-800 animate-pulse"></div>
                  <div className="h-6 w-24 rounded bg-gray-800 animate-pulse"></div>
                </div>
              </div>
              {/* Body */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-gray-800 last:border-none hover:bg-gray-800/50 transition-colors"
                >
                  <div className="grid grid-cols-4 gap-4 p-4">
                    <div className="h-5 w-40 rounded bg-gray-800/50 animate-pulse"></div>
                    <div className="h-5 w-96 rounded bg-gray-800/50 animate-pulse"></div>
                    <div className="h-5 w-24 rounded bg-gray-800/50 animate-pulse"></div>
                    <div className="h-5 w-32 rounded bg-gray-800/50 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : workshops?.length === 0 ? (
          <div className="mt-10 border border-gray-800 rounded-lg p-5 flex items-center justify-center py-20">
            <div className="text-slate-400 text-lg flex flex-col items-center gap-2">
              <UserRoundSearch className="w-10 h-10" />
              <p className="text-2xl font-bold">No workshops found</p>
              <p className="text-slate-400">
                Create a workshop to start selling your content to your
                audience.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops?.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell>{workshop.name}</TableCell>
                    <TableCell>{workshop.description}</TableCell>
                    <TableCell>${(workshop.price / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(workshop.time * 1000).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
