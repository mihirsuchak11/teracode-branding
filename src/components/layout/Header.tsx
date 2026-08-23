"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Close, Menu } from "@/components/ui/icons";

function Dropdown({
  label,
  open,
  onToggle,
  children,
  panelClassName = "w-72",
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Panel width; the two-column products menu passes a wider one. */
  panelClassName?: string;
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
            <div
              className={`rounded-card border border-border-strong/50 bg-surface p-2 shadow-2xl shadow-black/60 ${panelClassName}`}
            >
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
  const mail = href.startsWith("mailto:");
  const external = href.startsWith("http");
  const cls = "block rounded-btn px-3 py-2.5 transition-colors hover:bg-surface-2";
  const inner = (
    <>
      <span className="block text-sm font-medium text-fg-soft">{label}</span>
      {description && <span className="mt-0.5 block text-xs text-fg-muted">{description}</span>}
    </>
  );
  return mail ? (
    <a href={href} className={cls} onClick={onNavigate}>
      {inner}
    </a>
  ) : external ? (
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
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] bg-bg px-4 md:px-10 lg:px-16">
      {/* Same 1600px cap as the page frame in layout.tsx */}
      <div className="mx-auto flex h-full w-full max-w-[1600px] items-center gap-10 px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/teracode-logo-horizontal-white.svg"
            alt="TeraCodeAI"
            width={113}
            height={28}
            className="h-7 w-auto select-none"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown
            label="Products"
            open={openMenu === "features"}
            onToggle={() => setOpenMenu(openMenu === "features" ? null : "features")}
            panelClassName="w-[36rem]"
          >
            {/* Two columns: the agents we run, and the platform you build on. */}
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="pr-2">
                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                  Applications
                </p>
                {nav.products.applications.map((item) => (
                  <DropdownLink key={item.href} {...item} onNavigate={close} />
                ))}
              </div>
              <div className="pl-2">
                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                  Platform
                </p>
                {nav.products.platform.map((item) => (
                  <DropdownLink key={item.href} {...item} onNavigate={close} />
                ))}
              </div>
            </div>
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
          <Button href={nav.cta.href}>{nav.cta.label}</Button>
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
              {[
                ...nav.products.applications,
                ...nav.products.platform,
                ...nav.resources.company,
                ...nav.links,
              ].map((item) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-btn px-2 py-2.5 text-[15px] text-fg-soft hover:bg-surface"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-btn px-2 py-2.5 text-[15px] text-fg-soft hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <Button href={nav.cta.href} className="mt-3 w-full">
                {nav.cta.label}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
