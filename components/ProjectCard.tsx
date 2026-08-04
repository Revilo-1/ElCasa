import Link from "next/link";
import { Project } from "@/lib/types";
import { iconMap } from "./icons";
import ProgressBar from "./ProgressBar";

export default function ProjectCard({
  project,
  taskSummary,
  budgetSummary,
}: {
  project: Project;
  taskSummary: { total: number; afsluttet: number; procent: number };
  budgetSummary: { estimatLavt: number; estimatHoejt: number };
}) {
  const Icon = iconMap[project.ikon];
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-stone/70 bg-white/40 p-5 transition-colors hover:border-terracotta/60"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5 text-terracotta">
          <Icon />
        </div>
        <span className="font-mono text-xs text-ink/50">
          {taskSummary.afsluttet}/{taskSummary.total} opgaver
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">
          {project.navn}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{project.beskrivelse}</p>
      </div>
      <div className="mt-auto space-y-2">
        <ProgressBar percent={taskSummary.procent} />
        <p className="font-mono text-xs text-ink/50">
          {budgetSummary.estimatLavt.toLocaleString("da-DK")} –{" "}
          {budgetSummary.estimatHoejt.toLocaleString("da-DK")} kr.
        </p>
      </div>
    </Link>
  );
}
