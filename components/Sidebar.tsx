import Link from "next/link";
import { projects } from "@/lib/mock-data";
import { iconMap } from "./icons";

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-stone bg-plaster md:w-64 md:border-b-0 md:border-r">
      <div className="px-5 py-6 md:py-8">
        <Link href="/" className="block">
          <p className="font-display text-sm text-terracotta">Grundplan</p>
          <h1 className="font-display text-xl font-semibold leading-tight text-ink">
            Tværstræde 12
          </h1>
        </Link>
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-2 md:flex-col md:overflow-visible md:px-3">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-stone/40 hover:text-ink"
        >
          Overblik
        </Link>
        <Link
          href="/budget"
          className="flex shrink-0 items-center rounded-md px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-stone/40 hover:text-ink"
        >
          Budget
        </Link>
      </nav>
      <div className="mx-3 hidden border-t border-stone/70 md:block" />
      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-4 pt-2 md:flex-col md:overflow-visible md:px-3">
        {projects.map((project) => {
          const Icon = iconMap[project.ikon];
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-stone/40 hover:text-ink"
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
  );
}
