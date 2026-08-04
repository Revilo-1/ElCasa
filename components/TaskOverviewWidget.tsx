import Link from "next/link";
import { Task } from "@/lib/types";
import { StatusBadge, PriorityDot } from "./Badges";
import { projects, people } from "@/lib/mock-data";
import AvatarStack from "./AvatarStack";

function formatDeadline(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
}

export default function TaskOverviewWidget({
  akutte,
  snartDeadline,
  iGang,
  prioriteret,
}: {
  akutte: Task[];
  snartDeadline: Task[];
  iGang: Task[];
  prioriteret: Task[];
}) {
  return (
    <div className="rounded-lg border border-stone/70 bg-white/40 p-5">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-ink/70">
          <span className="h-2 w-2 rounded-full bg-terracotta" />
          {akutte.length} akutte
        </span>
        <span className="flex items-center gap-1.5 text-ink/70">
          <span className="h-2 w-2 rounded-full bg-pine" />
          {snartDeadline.length} med deadline &lt; 14 dage
        </span>
        <span className="flex items-center gap-1.5 text-ink/70">
          <span className="h-2 w-2 rounded-full bg-sage" />
          {iGang.length} i gang
        </span>
      </div>

      {prioriteret.length === 0 ? (
        <p className="text-sm text-ink/50">
          Ingen opgaver kræver opmærksomhed lige nu.
        </p>
      ) : (
        <ul className="divide-y divide-stone/50">
          {prioriteret.map((task) => {
            const project = projects.find((p) => p.slug === task.projectSlug);
            const assignedPeople = people.filter((person) =>
              task.ansvarlige.includes(person.id),
            );

            return (
              <li key={task.id} className="flex items-center gap-3 py-2.5">
                <PriorityDot priority={task.prioritet} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {task.titel}
                  </p>
                  <Link
                    href={`/projects/${task.projectSlug}`}
                    className="text-xs text-ink/50 hover:text-terracotta"
                  >
                    {project?.navn}
                  </Link>
                </div>
                <AvatarStack people={assignedPeople} />
                {task.deadline && (
                  <span className="shrink-0 font-mono text-xs text-ink/50">
                    {formatDeadline(task.deadline)}
                  </span>
                )}
                <StatusBadge status={task.status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
