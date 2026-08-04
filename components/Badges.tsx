import { TaskStatus, TaskType, TaskPriority } from "@/lib/types";

const statusStyles: Record<TaskStatus, string> = {
  "ikke-startet": "bg-stone/50 text-ink/70",
  "i-gang": "bg-terracotta/15 text-terracotta-dark",
  afsluttet: "bg-sage/15 text-sage",
};
const statusLabels: Record<TaskStatus, string> = {
  "ikke-startet": "Ikke startet",
  "i-gang": "I gang",
  afsluttet: "Afsluttet",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

const typeLabels: Record<TaskType, string> = {
  diy: "DIY",
  haandvaerker: "Håndværker",
  uafklaret: "Uafklaret",
};

export function TypeBadge({ type }: { type: TaskType }) {
  return (
    <span className="rounded-full border border-stone-dark/40 px-2.5 py-0.5 text-xs font-medium text-ink/70">
      {typeLabels[type]}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: TaskPriority }) {
  if (priority !== "akut") return null;
  return (
    <span
      title="Akut"
      className="inline-block h-2 w-2 shrink-0 rounded-full bg-terracotta"
    />
  );
}

export function ChildSafetyFlag() {
  return (
    <span
      title="Børnesikkerhed relevant"
      className="rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-medium text-sage"
    >
      Børnesikkerhed
    </span>
  );
}
