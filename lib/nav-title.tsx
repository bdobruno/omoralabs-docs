"use client";

import { LogoSVG } from "logo";
import Link from "next/link";
import { HiMenuAlt4 } from "react-icons/hi";

import { SidebarTrigger } from "components/layout/notebook/sidebar";

const navItems = [
  { name: "Docs", href: "/" },
  { name: "Components", href: "/" },
  { name: "Blocks", href: "/" },
  { name: "Templates", href: "/" },
  { name: "Playground", href: "/" },
];

export function NavTitle() {
  return (
    <>
    <div className="hidden sm:flex items-center md:px-10 px-4 ">
      <a
        href="https://omoralabs.com"
        className="cursor-pointer mr-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LogoSVG />
      </a>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-black dark:text-white hover:bg-fd-accent cursor-pointer rounded-md px-3 py-1 text-sm"
          >
            {item.name}
          </Link>
        ))}
    </div>
      <div className="flex sm:hidden ml-4">
        <span className="inline-flex">
          <SidebarTrigger
          >
            <div className="flex items-center justify-center gap-2 text-large">
            <HiMenuAlt4 />
              Menu
            </div>
          </SidebarTrigger>
        </span>
      </div>
    </>
  );
}
