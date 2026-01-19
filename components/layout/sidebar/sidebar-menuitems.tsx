"use client";
import { ChevronRight, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { usePathname, useRouter } from "next/navigation";
import { SidebarMenuType } from "@/config/schema";

export function NavMenuItems({ groupTitle, items }: { groupTitle: string , items: SidebarMenuType[] }) {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const isUrl = (u: any) => typeof u === "string" && u.length > 0;

  const handleMenuClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    if (typeof item.url === "function") {
      (item.url as Function)(item);
    }
    // Handle string URL - navigate programmatically
    else if (isUrl(item.url)) {
      router.push(item.url as string);
    }
    // Close sidebar on mobile
    if (isMobile) {
      toggleSidebar();
    }
  }

return (
    <SidebarGroup className="flex flex-col">
      <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const hasSub = Array.isArray(item.submenu) && item.submenu.length > 0;
          const hasDropdown = item.dropdownMenu; 

          if (hasSub) {
            return (
              <SidebarMenuItem key={item.title}>
                <Collapsible defaultOpen={isActive} className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "[&>svg]:size-4 h-9 p-3 pr-1.5",
                        isActive &&
                          "bg-gray-200 text-black hover:bg-gray/90 hover:text-gray-900"
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronRight className="ml-auto !size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.submenu!.map((sub) => {
                        const subActive = pathname === sub.url;
                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "pl-8 pr-3 py-1.5 text-sm",
                                subActive &&
                                  "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                              )}
                            >
                              <Link
                                href="#"
                                onClick={(e) => handleMenuClick(e, sub)}
                              >
                                {sub.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            );
          } else {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "[&>svg]:size-4 h-9 p-3",
                    isActive &&
                      "bg-gray-200 text-black hover:bg-gray/90 hover:text-gray-900"
                  )}
                >
                  <Link
                    href="#"
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {hasDropdown && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm">
                        <Ellipsis />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-24 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      {item.dropdownMenu?.map((dropdownItem, index) => (
                        <DropdownMenuItem key={index}>
                          {dropdownItem.icon && <dropdownItem.icon />}
                          <Link
                            href="#"
                            onClick={(e) => handleMenuClick(e, dropdownItem)}
                          >
                            <span>{dropdownItem.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}