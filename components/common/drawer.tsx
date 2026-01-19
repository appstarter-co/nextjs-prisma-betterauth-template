"use client";
import * as React from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter as DrawerFooterSection,
} from "@/components/ui/drawer";
import { useDrawer } from "@/context/use-drawer";

interface MyDrawerProps {
  open: boolean;
  item: any | null;
  onClose: () => void;
}

export function MyDrawer({ open, item, onClose }: MyDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-[420px]">
        <DrawerHeader className="flex flex-row items-center justify-between pr-2">
          <div className="space-y-1">
            <DrawerTitle>{item?.title || item?.name || "Details"}</DrawerTitle>
            {item?.description && <DrawerDescription className="line-clamp-2">{item.description}</DrawerDescription>}
          </div>
          <DrawerClose asChild>
            <button
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="size-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4 pt-1 overflow-y-auto text-sm space-y-4">
          {item ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Identifier</p>
                <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-xs">
                  {item.id || item.key || "(none)"}
                </code>
              </div>
              {item.description && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Description</p>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Raw JSON</p>
                <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded p-2 overflow-auto max-h-64">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <p className="text-neutral-500">Select an item to view details.</p>
          )}
        </div>

        <DrawerFooterSection className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-end gap-2 p-3">
            <DrawerClose asChild>
              <button
                onClick={onClose}
                className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </DrawerClose>
          </div>
        </DrawerFooterSection>
      </DrawerContent>
    </Drawer>
  );
}

export function GlobalDrawerMount() {
  const { open, item, closeDrawer } = useDrawer();
  return <MyDrawer open={open} item={item} onClose={closeDrawer} />;
}
