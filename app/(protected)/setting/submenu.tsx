"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wrench,   
  Coins,      
  CheckSquare,
  AppWindow,
  Bell,
  ChevronDown,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsItems = [
  {
    id: "general",
    href: "/setting",
    label: "General",
    icon: Wrench,
  },
  {
    id: "billing",
    href: "#",
    label: "Billing", 
    icon: Coins,
  },
  {
    id: "plans",
    href: "#",
    label: "Plans",
    icon: CheckSquare,
  },
  {
    id: "connected-apps",
    href: "#",
    label: "Connected Apps",
    icon: AppWindow,
  },
  {
    id: "notifications",
    href: "#",
    label: "Notifications",
    icon: Bell,
  },
];

export default function SettingsNavigation() {
  const pathname = usePathname();
  
  const currentItem = settingsItems.find(item => item.href === pathname) || settingsItems[0];

  return (
    <aside className="lg:sticky lg:w-1/5">
      {/* Mobile Dropdown */}
      <div className="p-1 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 h-10">
            <span>
              <div className="flex gap-x-4 px-2 py-0.5">
                <span className="scale-125 [&_svg]:size-[1.125rem]">
                  <currentItem.icon />
                </span>
                <span className="text-md">{currentItem.label}</span>
              </div>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            {settingsItems.map((item) => {
              const isSelected = pathname === item.href;
              
              return (
                <DropdownMenuItem key={item.id} asChild>
                  <Link 
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-2",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                    {isSelected && <Check className="ml-auto size-4" />}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Navigation */}
      <div
        dir="ltr"
        className="relative overflow-hidden bg-background hidden w-full min-w-48 px-3 py-2 md:block"
      >
        <div className="h-full w-full rounded-[inherit] overflow-x-auto">
          <nav className="flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0">
            {settingsItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 px-4 py-2 justify-start",
                    isActive
                      ? "bg-muted hover:bg-muted text-muted-foreground font-semibold"
                      : "hover:bg-transparent hover:underline"
                  )}
                >
                  <span className="mr-2 [&_svg]:size-[1.125rem]">
                    <item.icon />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}