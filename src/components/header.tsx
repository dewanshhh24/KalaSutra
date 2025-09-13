"use client";

import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
