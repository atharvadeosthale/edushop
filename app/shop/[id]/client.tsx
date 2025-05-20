"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import WorkshopCard from "@/components/workshop-card";

export function ShopClientPage({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data: shopDetails, isLoading: isShopDetailsLoading } = useQuery(
    trpc.getShopDetails.queryOptions({ id })
  );

  const { data: workshops, isLoading: isWorkshopsLoading } = useQuery(
    trpc.getWorkshopsById.queryOptions({ id })
  );

  if (isShopDetailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-white p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-black/20 dark:border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-r-4 border-black dark:border-white rounded-full animate-spin duration-700"></div>
          </div>
          <div className="mt-8 text-xl font-extralight tracking-widest uppercase">
            Loading
          </div>
        </div>
      </div>
    );
  }

  if (!shopDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-white p-4">
        <div className="text-center max-w-md mx-auto px-10 py-14 bg-white dark:bg-[#0F0F0F] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-lg">
          <div className="inline-block p-2 mb-6 rounded-full bg-black/5 dark:bg-white/5">
            <svg
              className="w-10 h-10 text-black/80 dark:text-white/80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="text-3xl font-light tracking-wide mb-3">
            Shop Not Found
          </div>
          <p className="text-black/60 dark:text-white/60 font-light">
            The shop you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] dark:from-white/[0.03] to-transparent h-64 pointer-events-none"></div>
        <div className="container max-w-5xl mx-auto px-6 pt-16 pb-24">
          <header className="flex flex-col items-center mb-20">
            {shopDetails.image && (
              <div className="mb-8 relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5 rounded-full blur-md"></div>
                <div className="relative rounded-full p-1 bg-gradient-to-r from-black/20 via-black/30 to-black/20 dark:from-white/20 dark:via-white/30 dark:to-white/20">
                  <img
                    src={shopDetails.image}
                    alt={`${shopDetails.name}'s profile`}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border border-white/60 dark:border-black/60"
                  />
                </div>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-2xl text-center">
              {shopDetails.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-black/20 dark:bg-white/20"></div>
              <div className="text-sm uppercase tracking-[0.3em] text-black/60 dark:text-white/60 font-medium">
                Workshop Collection
              </div>
              <div className="h-px w-12 bg-black/20 dark:bg-white/20"></div>
            </div>
          </header>

          <section className="relative">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl opacity-50"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl md:text-3xl font-medium">
                  Our workshops
                </h2>
                <div className="h-px flex-grow ml-8 bg-gradient-to-r from-black/10 dark:from-white/10 to-transparent"></div>
              </div>

              {isWorkshopsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="relative h-full p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl"
                    >
                      <div className="animate-pulse">
                        <div className="h-6 bg-black/10 dark:bg-white/10 rounded mb-4 w-3/4"></div>
                        <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-4"></div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10"></div>
                            <div className="flex justify-between w-full">
                              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-16"></div>
                              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10"></div>
                            <div className="flex justify-between w-full">
                              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-16"></div>
                              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                        <div className="h-20 bg-black/5 dark:bg-white/5 rounded mt-6"></div>
                        <div className="h-10 bg-black/10 dark:bg-white/10 rounded mt-6 w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : workshops && workshops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {workshops.map((workshop) => (
                    <WorkshopCard
                      key={workshop.id}
                      id={workshop.id}
                      name={workshop.name}
                      description={workshop.description}
                      time={workshop.time}
                      price={workshop.price}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl">
                  <div className="w-16 h-16 mb-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-black/40 dark:text-white/40"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-xl text-black/80 dark:text-white/80 mb-2 font-light">
                    No workshops available
                  </p>
                  <p className="text-black/40 dark:text-white/40 text-center max-w-sm">
                    There are no workshops scheduled at the moment. Please check
                    back later.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
