"use client";
import GridShape from "@/components/common/grid-shape";
import ThemeToggler from "@/components/common/theme-toggle-button1";
import { useConfig } from "@/context/use-config";

import { ThemeProvider } from "@/context/use-theme";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = useConfig();
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-gray-900 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-13 w-13 items-center justify-center rounded-xl bg-primary/30 dark:bg-primary/20">
                      <config.siteConfig.logo className="h-8 w-8 text-primary" />
                    </span>
                    <span className="text-3xl font-semibold tracking-tight text-white dark:text-white">
                      {config.siteConfig.siteName}
                    </span>
                  </div>
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Full stack Nextjs Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>
          <div className="fixed top-6 right-6 z-50 hidden sm:block">
            <ThemeToggler />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
