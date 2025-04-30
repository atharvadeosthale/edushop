import { AppRouter } from "@/server";
import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
// export const { TRPCProvider, useTRPC, useTRPCClient } =
//   createTRPCContext<AppRouter>();
