"use client";
import NotificationDropdown from "@/components/layout/header/notification-dropdown";
import UserDropdown from "@/components/layout/header/user-dropdown";
import { ThemeToggleButton } from "@/components/common/theme-toggle-button";
import Link from "next/link";
import { PanelLeftIcon, Type, X, MoreHorizontal, Layers3 } from "lucide-react";
import React, { useState ,useEffect,useRef} from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { user } from "@/lib/generated/prisma/client";
import TypeaheadSearch from "@/components/layout/header/typeahead-search";

interface SiteHeaderProps {
  user: user | null;
}

const SiteHeader = ({ user }: SiteHeaderProps) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { openMobile, toggleSidebar } = useSidebar();

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="z-49 sticky top-0 flex h-(--header-height) w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-black lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:pr-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0">
          <button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            className="items-center justify-center w-16 h-16 text-gray-500 z-99999 lg:flex dark:text-gray-400"
            onClick={(event) => {
              toggleSidebar()
            }}
            aria-label="Toggle Sidebar">
            {openMobile ? (
              <X className="size-5" /> 
            ) : (
              <PanelLeftIcon className="size-5"/>
            )}
            {/* Cross Icon */}
          </button>
          <Link href="/" className="lg:hidden">
            <Layers3 className="h-8 w-8 text-primary" />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <MoreHorizontal className="size-5" />
          </button>

          <div className="hidden lg:block">
            <TypeaheadSearch inputRef={inputRef} />
          </div>
        </div>
        <div id="right-header-menu"
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } bg-white dark:bg-black items-center justify-between w-full gap-4 px-5 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3 pt-2 pb-2">
            <ThemeToggleButton />   
            <NotificationDropdown /> 
          </div>
          <UserDropdown user={user}/> 
    
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;