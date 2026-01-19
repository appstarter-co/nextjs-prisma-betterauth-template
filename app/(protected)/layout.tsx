import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import SiteHeader from "@/components/layout/header/protected-site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DrawerProvider } from "@/context/use-drawer";
import { GlobalDrawerMount } from "@/components/common/drawer";

import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { user } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user?.id) {
    redirect("/login?reason=session_expired");
  }

  const sidebarWidth = "calc(var(--spacing) * 70)";
  const headerHeight = "calc(var(--spacing) * 17)";

  return (
    <>
      <DrawerProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": sidebarWidth,
              "--header-height": headerHeight,
            } as React.CSSProperties
          }
        >
          <AppSidebar user={session?.user as user} variant="inset" />
          <SidebarInset>
            <SiteHeader
              user={
                session?.user
                  ? {
                      ...session?.user,
                      role: session?.user.role ?? null,
                      phoneNumber: session?.user.phoneNumber ?? null,
                      image: session.user.image ?? null,
                      facebook: session?.user.facebook ?? null,
                      twitter: session?.user.twitter ?? null,
                      linkedin: session?.user.linkedin ?? null,
                      instagram: session?.user.instagram ?? null
                    }
                  : null
              }
            />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <GlobalDrawerMount />
      </DrawerProvider>
    </>
  );
}
