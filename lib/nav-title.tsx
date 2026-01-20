"use client";

import { LogoSVG } from "logo";
import Link from "next/link";
import { DrawerMenu } from "components/drawer-menu"

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
    <div className="hidden [@media(min-width:850px)]:flex items-center md:px-10 px-4 ">
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
      <DrawerMenu
        showText
        className="[@media(min-width:850px)]:hidden"
      />
    </>
  );
}
