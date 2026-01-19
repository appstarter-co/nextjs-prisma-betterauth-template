import type { Metadata } from "next";
import { ThemeProvider } from "@/context/use-theme";
import { ConfigProvider } from "@/context/use-config";
import { Geist, Geist_Mono } from "next/font/google";
import AnalyticsScripts, { RouteAnalytics } from "@/components/common/analytics";
import "./globals.css";
import Chatbot from "@/components/common/chatbot";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nextjs-prisma-betterauth-free-template",
  description: "Auth System with Better Auth, Prisma, and Next.js 15",
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
        {children}
      <Chatbot />
    </ConfigProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense fallback={null}>
      <head>
        <AnalyticsScripts />
        <RouteAnalytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
      </Suspense>
    </html>
  );
}
