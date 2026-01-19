"use client";
import React from "react";
import { useTheme } from "@/context/use-theme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggler() {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-gray-300 transition-colors hover:bg-brand-600 relative"
    >
      <Sun className="hidden dark:block h-5 w-5" />
      <Moon className="dark:hidden h-5 w-5" />
    </button>
  )
}