"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { LogoWordmark } from "@/components/ui/logo";
import { brand } from "@/data/brand";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-24">
        {/* Logo */}
        <Link
          href="/"
          aria-label={`${brand.name} – Startseite`}
          className="logo-link text-foreground"
        >
          <LogoWordmark className="h-[26px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {brand.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right: theme toggle + CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <ModeToggle />
          <Button asChild size="sm">
            <Link href="#kontakt">{brand.hero.cta.primary}</Link>
          </Button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menü öffnen">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 px-6 pt-16">
              <nav className="flex flex-col gap-2">
                {brand.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <Separator className="my-4" />
                <Button asChild>
                  <Link href="#kontakt" onClick={() => setOpen(false)}>
                    {brand.hero.cta.primary}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
