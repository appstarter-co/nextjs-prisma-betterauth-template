"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadAppConfig } from "@/config/loader";
import { AppConfigType } from "@/config/schema";

const ConfigContext = createContext<AppConfigType | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfigType | null>(null);

  useEffect(() => {
    loadAppConfig().then(setConfig).catch(console.error);
  }, []);

  if (!config) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-3 border-gray-300 border-t-primary animate-spin mb-4"></div>
        <div className="text-gray-600 text-sm font-medium animate-pulse">Loading...</div>
      </div>
    </div>
  );

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext)!;
