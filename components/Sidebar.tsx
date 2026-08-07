"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { projects } from "@/lib/mock-data";
import { iconMap } from "./icons";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const mainLinkClass =
    "flex items-center rounded-md px-3 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-stone/40 hover:text-ink md:py-2.5";
  const projectLinkClass =
    "group flex items-center gap-3 rounded-md px-3 py-3 text-sm text-ink/80 transition-colors hover:bg-stone/40 hover:text-ink md:py-2.5";

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone bg-plaster/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="block">
          <h1 className="font-display text-lg font-semibold leading-tight text-ink">
            Tværstræde 12
          </h1>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Luk menu" : "Åbn menu"}
          aria-expanded={mobileOpen}
          className="rounded-md border border-stone-dark/35 bg-white/60 p-2 text-ink transition-colors hover:bg-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {mobileOpen ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Luk menu-overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-[1px] md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] shrink-0 flex-col border-r border-stone bg-plaster transition-transform duration-300 md:static md:z-auto md:h-auto md:w-64 md:max-w-none md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden px-5 py-8 md:block">
          <Link href="/" className="block">
            <p className="font-display text-sm text-terracotta">Grundplan</p>
            <h1 className="font-display text-xl font-semibold leading-tight text-ink">
              Tværstræde 12
            </h1>
          </Link>
        </div>

        <div className="border-b border-stone/70 px-4 pb-3 pt-4 md:hidden">
          <Link href="/" className="block" onClick={() => setMobileOpen(false)}>
            <p className="font-display text-sm text-terracotta">Grundplan</p>
            <h2 className="font-display text-xl font-semibold leading-tight text-ink">
              Tværstræde 12
            </h2>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 px-3 pb-2 pt-3 md:pt-0">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={mainLinkClass}
          >
            Overblik
          </Link>
          <Link
            href="/budget"
            onClick={() => setMobileOpen(false)}
            className={mainLinkClass}
          >
            Budget
          </Link>
          <Link
            href="/tasks"
            onClick={() => setMobileOpen(false)}
            className={mainLinkClass}
          >
            To Do
          </Link>
        </nav>

        <div className="mx-3 border-t border-stone/70" />

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4 pt-2">
          {projects.map((project) => {
            const Icon = iconMap[project.ikon];
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                onClick={() => setMobileOpen(false)}
                className={projectLinkClass}
              >
                <span className="text-terracotta">
                  <Icon />
                </span>
                <span className="whitespace-nowrap">{project.navn}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
