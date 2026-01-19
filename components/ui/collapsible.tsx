import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

// Simple `cn` helper (classNames). Replace with your project's util if you have one.
function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export interface CollapsibleProps extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, "title"> {
  title: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ title, children, defaultOpen = false, ...props }) => {
  // Pass all props except 'title' to CollapsiblePrimitive.Root
  return (
    <CollapsiblePrimitive.Root defaultOpen={defaultOpen} {...props}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsiblePrimitive.Trigger
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span>{title}</span>
          <ChevronDown className="transition-transform duration-200" aria-hidden />
        </CollapsiblePrimitive.Trigger>

        <CollapsiblePrimitive.Content asChild>
          <div className="px-4 pb-4 pt-2 text-sm text-gray-700 animate-collapsible-enter">
            {children}
          </div>
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  );
};

export default Collapsible;
