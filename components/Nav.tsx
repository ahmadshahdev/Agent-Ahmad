"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Bot, Menu, X, Sparkles } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-neutralLight-border shadow-subtle transition-colors">
      <nav className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl h-16 flex items-center justify-between">
        {/* Logo / Brand Left */}
        <Link
          href="/"
          className="flex items-center gap-xs sm:gap-sm group focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-xs"
          onClick={closeMenu}
        >
          <div className="w-9 h-9 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-all shadow-subtle">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-neutralDark leading-none group-hover:text-primary transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[11px] font-body text-neutralLight-muted flex items-center gap-1 font-medium mt-0.5">
              <Sparkles className="w-3 h-3 text-primary" />
              {siteConfig.agentName}
            </span>
          </div>
        </Link>

        {/* Desktop Links Right */}
        <div className="hidden md:flex items-center gap-md lg:gap-lg">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-body text-sm font-semibold text-neutralDark-muted hover:text-primary transition-colors px-xs py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {link.name}
            </Link>
          ))}

          {/* Available for Work Indicator */}
          {siteConfig.availableForWork && (
            <div className="flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Available for Hire</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-sm rounded-md text-neutralDark hover:bg-neutralLight-card hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-neutralLight-border shadow-floating animate-in slide-in-from-top duration-200">
          <div className="px-md pt-sm pb-lg space-y-xs">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="block font-body text-base font-medium text-neutralDark hover:text-primary hover:bg-primary-light px-md py-sm rounded-md transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {siteConfig.availableForWork && (
              <div className="pt-sm mt-sm border-t border-neutralLight-border flex items-center justify-between px-md py-xs">
                <span className="text-xs font-body text-neutralLight-muted">
                  Status
                </span>
                <div className="flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>Available for Hire</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
