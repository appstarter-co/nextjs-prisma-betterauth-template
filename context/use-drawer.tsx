"use client";
import React from "react";

interface DrawerState {
  open: boolean;
  item: any | null;
  openDrawer: (item: any) => void;
  closeDrawer: () => void;
}

const DrawerContext = React.createContext<DrawerState | undefined>(undefined);

// Module-level refs for global functions (no direct context usage required)
let _openDrawerRef: ((item: any) => void) | null = null;
let _closeDrawerRef: (() => void) | null = null;

// Global helpers
export function openDrawer(item: any) {
  if (!_openDrawerRef) throw new Error("openDrawer called before DrawerProvider mounted.");
  _openDrawerRef(item);
}
export function closeDrawer() {
  if (!_closeDrawerRef) throw new Error("closeDrawer called before DrawerProvider mounted.");
  _closeDrawerRef();
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState<any | null>(null);

  const openDrawerLocal = React.useCallback((i: any) => {
    setItem(i);
    setOpen(true);
  }, []);
  const closeDrawerLocal = React.useCallback(() => setOpen(false), []);

  // Sync local handlers to module-level refs
  React.useEffect(() => {
    _openDrawerRef = openDrawerLocal;
    _closeDrawerRef = closeDrawerLocal;
    return () => {
      _openDrawerRef = null;
      _closeDrawerRef = null;
    };
  }, [openDrawerLocal, closeDrawerLocal]);

  return (
    <DrawerContext.Provider
      value={{ open, item, openDrawer: openDrawerLocal, closeDrawer: closeDrawerLocal }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used inside DrawerProvider");
  return ctx;
}