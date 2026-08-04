import { Task, Person } from "@/lib/types";
import { StatusBadge, TypeBadge, PriorityDot, ChildSafetyFlag } from "./Badges";
import AvatarStack from "./AvatarStack";

export default function TaskList({
  tasks,
  people,
}: {
  tasks: Task[];
  people: Person[];
}) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-dark/40 px-4 py-8 text-center text-sm text-ink/50">
        Ingen opgaver endnu i dette område. Tilføj den første i lib/mock-data.ts
        - eller i Supabase, når den er koblet på.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stone/60 rounded-lg border border-stone/70">
      {tasks.map((task) => {
        const assignedPeople = people.filter((person) =>
          task.ansvarlige.includes(person.id),
        );

        return (
          <li
            key={task.id}
            className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5">
              <PriorityDot priority={task.prioritet} />
              <div>
                <p className="text-sm font-medium text-ink">{task.titel}</p>
                {task.beskrivelse && (
                  <p className="mt-0.5 text-xs text-ink/55">
                    {task.beskrivelse}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              {task.boernesikkerhed && <ChildSafetyFlag />}
              <TypeBadge type={task.type} />
              <StatusBadge status={task.status} />
              <AvatarStack people={assignedPeople} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
