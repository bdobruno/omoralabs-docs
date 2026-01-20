"use client";

import { SidebarTrigger } from "components/layout/notebook/sidebar";
import { HiMenuAlt4 } from "react-icons/hi";
import { cn } from "../lib/cn";

export function DrawerMenu({
  showText,
  className,
}: {
  showText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex ml-4", className)}>
      <span className="inline-flex">
        <SidebarTrigger>
          <div className="flex items-center justify-center gap-2 text-xl">
            <HiMenuAlt4 />
            {showText && "Menu"}
          </div>
        </SidebarTrigger>
      </span>
    </div>
  );
}
