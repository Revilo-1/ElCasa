import { Project } from "@/lib/types";

export interface AreaBudgetRow {
  project: Project;
  estimeret: number;
  faktisk: number;
}

export default function BudgetComparisonChart({
  rows,
}: {
  rows: AreaBudgetRow[];
}) {
  const filtered = rows.filter((r) => r.estimeret > 0 || r.faktisk > 0);
  const max = Math.max(1, ...filtered.map((r) => Math.max(r.estimeret, r.faktisk)));

  if (filtered.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-dark/40 px-4 py-8 text-center text-sm text-ink/50">
        Ingen budgetposter endnu at sammenligne.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 text-xs text-ink/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-terracotta" /> Estimeret
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-pine" /> Faktisk
        </span>
      </div>
      {filtered.map(({ project, estimeret, faktisk }) => (
        <div key={project.slug}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-sm font-medium text-ink">{project.navn}</p>
            <p className="font-mono text-xs text-ink/50">
              {estimeret.toLocaleString("da-DK")} kr. estimeret
            </p>
          </div>
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded-full bg-stone/40">
              <div
                className="h-full rounded-full bg-terracotta"
                style={{ width: `${(estimeret / max) * 100}%` }}
              />
            </div>
            <div className="h-2.5 w-full rounded-full bg-stone/40">
              <div
                className="h-full rounded-full bg-pine"
                style={{ width: `${(faktisk / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
