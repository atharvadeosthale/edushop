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
        window.location.href = data;
      },
    })
  );

  if (isWorkshopsLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-r-4 border-white rounded-full animate-spin duration-700"></div>
          </div>
          <div className="mt-8 text-xl font-extralight tracking-widest uppercase">
            Loading
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent h-64 pointer-events-none"></div>
        <div className="container max-w-7xl mx-auto px-6 pt-16 pb-24">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-4">
                Welcome,{" "}
                <span className="text-blue-500">
                  {user?.name?.split(" ")[0]}
                </span>
              </h1>
              <div className="text-lg text-white/60 max-w-3xl">
                This is your creator dashboard. Here you can create and manage
                workshops, view purchases, and track your creator journey.
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full blur-md"></div>
              {user?.image ? (
                <div className="relative rounded-full p-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20">
                  <img
                    src={user.image}
                    alt={user.name ?? "User profile picture"}
                    className="w-32 h-32 rounded-full object-cover border border-black/60"
                  />
                </div>
              ) : (
                <div className="relative rounded-full p-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20">
                  <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border border-black/60">
                    <UserCircleIcon className="w-24 h-24 text-white/60" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!stripeConnectionId && (
            <div className="mb-16 border border-green-700/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,128,0,0.05)_10px,rgba(0,128,0,0.05)_20px)]"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl opacity-50"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4">
                  Set up payments with Stripe
                </h2>
                <p className="text-white/60 max-w-3xl mb-6">
                  Before you can start selling your workshops, you need to set
                  up payments by creating a Stripe account dedicated to Edushop.
                  This is where you will receive all your payments and Stripe
                  will facilitate with the payouts.
                </p>
                <Button
                  onClick={() => createStripeConnection()}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-none"
                >
                  {isStripeConnectionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Setup payments
                </Button>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-50"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">Your Workshops</h2>
                <div className="h-px flex-grow ml-8 bg-gradient-to-r from-white/10 to-transparent"></div>
                <CreateWorkshop />
              </div>

              {isWorkshopsLoading ? (
                <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
                  <div className="border-b border-white/10">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div className="h-6 w-20 rounded bg-white/10 animate-pulse"></div>
                      <div className="h-6 w-32 rounded bg-white/10 animate-pulse"></div>
                      <div className="h-6 w-16 rounded bg-white/10 animate-pulse"></div>
                      <div className="h-6 w-24 rounded bg-white/10 animate-pulse"></div>
                    </div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-b border-white/10 last:border-none hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="grid grid-cols-4 gap-4 p-4">
                        <div className="h-5 w-40 rounded bg-white/5 animate-pulse"></div>
                        <div className="h-5 w-full rounded bg-white/5 animate-pulse"></div>
                        <div className="h-5 w-24 rounded bg-white/5 animate-pulse"></div>
                        <div className="h-5 w-32 rounded bg-white/5 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : workshops?.length === 0 ? (
                <div className="flex items-center justify-center py-20 px-8 bg-white/[0.02] border border-white/10 rounded-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                      <UserRoundSearch className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-xl text-white/80 mb-2 font-light">
                      No workshops found
                    </p>
                    <p className="text-white/40 text-center max-w-sm">
                      Create a workshop to start selling your content to your
                      audience.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/[0.04] border-white/10">
                        <TableHead className="text-white/70">Name</TableHead>
                        <TableHead className="text-white/70">
                          Description
                        </TableHead>
                        <TableHead className="text-white/70">Price</TableHead>
                        <TableHead className="text-white/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workshops?.map((workshop) => (
                        <TableRow
                          key={workshop.id}
                          className="hover:bg-white/[0.04] border-white/10"
                        >
                          <TableCell className="font-medium">
                            {workshop.name}
                          </TableCell>
                          <TableCell className="text-white/70">
                            {workshop.description}
                          </TableCell>
                          <TableCell className="text-white/70">
                            ${(workshop.price / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white/70">
                            {new Date(
                              workshop.time * 1000
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
