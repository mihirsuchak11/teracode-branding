"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site";
import { ChevronDown, Close, LogoMark, LogoWord, Menu } from "@/components/ui/icons";

function Dropdown({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseLeave={() => open && onToggle()}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        onMouseEnter={() => !open && onToggle()}
        className="flex items-center gap-1 p-2"
      >
        <span
          className={`px-1.5 text-sm font-medium leading-5 transition-colors ${
            open ? "text-fg" : "text-fg-soft hover:text-fg"
          }`}
        >
          {label}
        </span>
        <ChevronDown
          width={16}
          height={16}
          className={`text-fg-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2"
          >
            <div className="w-72 rounded-card border border-border-strong/50 bg-surface p-2 shadow-2xl shadow-black/60">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownLink({
  href,
  label,
  description,
  onNavigate,
}: {
  href: string;
  label: string;
  description?: string;
  onNavigate: () => void;
}) {
  const external = href.startsWith("http");
  const cls = "block rounded-btn px-3 py-2.5 transition-colors hover:bg-surface-2";
  const inner = (
    <>
      <span className="block text-sm font-medium text-fg-soft">{label}</span>
      {description && <span className="mt-0.5 block text-xs text-fg-muted">{description}</span>}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls} onClick={onNavigate}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<"features" | "resources" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setOpenMenu(null);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] bg-bg">
      <div className="mx-4 flex h-full items-center gap-10 px-6 md:mx-10 md:px-10 lg:mx-16">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <LogoMark className="text-fg" />
          <LogoWord className="text-fg" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown
            label="Features"
            open={openMenu === "features"}
            onToggle={() => setOpenMenu(openMenu === "features" ? null : "features")}
          >
            {nav.features.map((item) => (
              <DropdownLink key={item.href} {...item} onNavigate={close} />
            ))}
          </Dropdown>
          <Dropdown
            label="Resources"
            open={openMenu === "resources"}
            onToggle={() => setOpenMenu(openMenu === "resources" ? null : "resources")}
          >
            <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
              Support
            </p>
            {nav.resources.support.map((item) => (
              <DropdownLink key={item.href} {...item} onNavigate={close} />
            ))}
            <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
              Company
            </p>
            {nav.resources.company.map((item) => (
              <DropdownLink key={item.href} {...item} onNavigate={close} />
            ))}
          </Dropdown>
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center p-2"
            >
              <span className="px-1.5 text-sm font-medium leading-5 text-fg-soft transition-colors hover:text-fg">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <Link
            href={nav.cta.href}
            className="inline-flex items-center rounded-lg bg-fg-soft p-2 transition-colors hover:bg-fg"
          >
            <span className="px-1.5 text-sm font-medium leading-5 text-[#1c1917]">
              {nav.cta.label}
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="ml-auto text-fg md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <Close width={22} height={22} /> : <Menu width={22} height={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-bg md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {[...nav.features, ...nav.resources.company, ...nav.links].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-btn px-2 py-2.5 text-[15px] text-fg-soft hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={nav.cta.href}
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-[10px] bg-fg-soft px-5 text-sm font-medium text-bg"
              >
                {nav.cta.label}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
