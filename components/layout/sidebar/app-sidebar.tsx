"use client";
import * as React from "react";
import { X } from "lucide-react";
import { NavMenuItems } from "@/components/layout/sidebar/sidebar-menuitems";
import { NavUser } from "@/components/layout/sidebar/sidebar-user";
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { user } from "@/lib/generated/prisma/client";
import { useConfig } from "@/context/use-config";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: user;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  
  const config = useConfig();
  if (!config) return null;
  console.log("App Config:", config);

  const { toggleSidebar, openMobile, open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full items-center">
            <div className="flex items-center justify-between w-full">
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/">
                  <config.siteConfig.logo className="!size-6" />
                  <span className="text-base font-semibold">{config.branding.appName}</span>
                </a>
              </SidebarMenuButton>
              {openMobile && (
                <button
                  data-sidebar="trigger"
                  data-slot="sidebar-trigger"
                  className="items-end justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  onClick={(event) => {
                    toggleSidebar();
                  }}
                  aria-label="Toggle Sidebar"
                >
                  <X className="!size-5" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-1">
        <NavMenuItems groupTitle="General" items={config?.sidebarMenu?.navMain} />
        <NavMenuItems groupTitle="Examples" items={config?.sidebarMenu?.documents} />
        <NavMenuItems groupTitle="Other" items={config?.sidebarMenu?.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
