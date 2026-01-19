"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/logout-button";
import { LogOut, ChevronDown, UserCircle, Settings, Info } from "lucide-react"; // Added lucide icons
import { user } from "@/lib/generated/prisma/client";
import { capitalizeFirstLetter } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { openChatbot } from "@/components/common/chatbot";
import { UserAvatar } from "@/components/common/user-avatar";

export default function UserDropdown({ user: initialUser }: { user: user | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user || initialUser;

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle !outline-none"
          >
            <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
              <UserAvatar user={{ name: user?.name, image: '' }} size={44} />
            </span>

            <span className="block mr-1 font-medium text-theme-sm">
              {capitalizeFirstLetter(
                user?.name.split(/[,\s]+/)[0] || "Account"
              )}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            side="bottom"
            align="end"
            className="mt-[5px] flex w-[260px] flex-col"
        >
          <div className="p-2">
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {capitalizeFirstLetter(user?.name ?? "Your Name")}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </span>
          </div>

          <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                asChild
              >
                <Link
                  href="/account"
                  onClick={closeDropdown}
                  className="flex items-center gap-3"
                >
                  <UserCircle className="size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  Edit profile
                </Link>
              </DropdownMenuItem>
            </li>
            <li>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                asChild
              >
                <Link
                  href="/setting"
                  onClick={closeDropdown}
                  className="flex items-center gap-3"
                >
                  <Settings className="size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  Account settings
                </Link>
              </DropdownMenuItem>
            </li>
            <li>
              <DropdownMenuItem
                onClick={()=>{openChatbot(); closeDropdown();}}
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Info className="size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Support
              </DropdownMenuItem>
            </li>
          </ul>
          <DropdownMenuItem className="p-3.5 gap-3 font-medium">
            <LogOut className="size-5" />
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}