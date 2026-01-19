"use client";
import { authClient } from "@/lib/auth-client";
import UserInfoCard from "./user-infocard";
import UserAddressCard from "./user-addresscard";
import { user } from "@/lib/generated/prisma/client";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="p-6">Loading...</div>;
  if (!session?.user) return null; // ProtectedRoute will redirect (or show nothing)

  return (
      <div className="pl-5 pr-5">
        <div className="space-y-6">
          <UserInfoCard user={session?.user as user} />
          <UserAddressCard />
        </div>
      </div>
  );
}
