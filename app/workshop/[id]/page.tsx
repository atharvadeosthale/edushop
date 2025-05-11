import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/trpc/server";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    unauthorized();
  }

  const queryClient = getQueryClient();

  return <div>Page</div>;
}
