"use client";

import { useMemo, useRef, useState } from "react";
import { people, projects, tasks as initialTasks } from "@/lib/mock-data";
import { Area, Task, TaskStatus } from "@/lib/types";

import RichTextEditor from "@/components/RichTextEditor";
import AvatarStack, { Avatar } from "@/components/AvatarStack";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  rectIntersection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// ─── helpers ─────────────────────────────────────────────────────────────────

const statusOrder: TaskStatus[] = ["ikke-startet", "i-gang", "afsluttet"];

function statusLabel(s: TaskStatus) {
  return {
    "ikke-startet": "Ikke startet",
    "i-gang": "I gang",
    afsluttet: "Afsluttet",
  }[s];
}

function areaLabel(slug: Area) {
  return projects.find((p) => p.slug === slug)?.navn ?? slug;
}

function getDeadlineState(deadline?: string, status?: TaskStatus) {
  if (!deadline || status === "afsluttet") return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return { type: "overskredet" as const, diff };
  if (diff <= 14) return { type: "snart" as const, diff };
  return { type: "normal" as const, diff };
}

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
}

function getNextStatus(s: TaskStatus): TaskStatus {
  if (s === "ikke-startet") return "i-gang";
  if (s === "i-gang") return "afsluttet";
  return "ikke-startet";
}

// ─── Delte formular-felter ────────────────────────────────────────────────────

interface TaskFormFields {
  titel: string;
  projectSlug: Area;
  ansvarlige: string[];
  prioritet: "akut" | "normal" | "engang";
  deadline: string;
  noteHtml: string;
}

function emptyFields(): TaskFormFields {
  return {
    titel: "",
    projectSlug: "have",
    ansvarlige: [],
    prioritet: "normal",
    deadline: "",
    noteHtml: "",
  };
}

function fieldFromTask(task: Task): TaskFormFields {
  return {
    titel: task.titel,
    projectSlug: task.projectSlug,
    ansvarlige: task.ansvarlige,
    prioritet: task.prioritet,
    deadline: task.deadline ?? "",
    noteHtml: task.noteHtml ?? "",
  };
}

// ─── Formular-indhold (delt mellem ny + rediger) ─────────────────────────────

function TaskFormBody({
  fields,
  onChange,
}: {
  fields: TaskFormFields;
  onChange: (f: TaskFormFields) => void;
}) {
  function togglePerson(id: string) {
    onChange({
      ...fields,
      ansvarlige: fields.ansvarlige.includes(id)
        ? fields.ansvarlige.filter((x) => x !== id)
        : [...fields.ansvarlige, id],
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">
          Titel *
        </label>
        <input
          value={fields.titel}
          onChange={(e) => onChange({ ...fields, titel: e.target.value })}
          placeholder="Hvad skal gøres?"
          className="w-full rounded-lg border border-stone-dark/50 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">
          Rum / område
        </label>
        <select
          value={fields.projectSlug}
          onChange={(e) =>
            onChange({ ...fields, projectSlug: e.target.value as Area })
          }
          className="w-full rounded-lg border border-stone-dark/50 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.navn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">
          Ansvarlig
        </label>
        <div className="flex flex-wrap gap-2">
          {people.map((person) => {
            const active = fields.ansvarlige.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => togglePerson(person.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-terracotta bg-terracotta/10 text-ink"
                    : "border-stone-dark/40 text-ink/70 hover:bg-stone/40"
                }`}
              >
                <Avatar person={person} size="sm" />
                {person.navn}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">
            Prioritet
          </label>
          <select
            value={fields.prioritet}
            onChange={(e) =>
              onChange({
                ...fields,
                prioritet: e.target.value as TaskFormFields["prioritet"],
              })
            }
            className="w-full rounded-lg border border-stone-dark/50 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          >
            <option value="akut">Akut</option>
            <option value="normal">Normal</option>
            <option value="engang">Engang</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">
            Deadline
          </label>
          <input
            type="date"
            value={fields.deadline}
            onChange={(e) => onChange({ ...fields, deadline: e.target.value })}
            className="w-full rounded-lg border border-stone-dark/50 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">
          Note <span className="text-ink/35">(valgfri)</span>
        </label>
        <RichTextEditor
          value={fields.noteHtml}
          onChange={(html) => onChange({ ...fields, noteHtml: html })}
        />
      </div>
    </div>
  );
}

// ─── Ny opgave-modal ─────────────────────────────────────────────────────────

function NewTaskModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (f: TaskFormFields) => void;
}) {
  const [fields, setFields] = useState<TaskFormFields>(emptyFields());

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-lg rounded-2xl border border-stone/70 bg-plaster shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone/70 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Ny opgave
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink/40 transition hover:text-ink"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <TaskFormBody fields={fields} onChange={setFields} />
        </div>

        <div className="flex justify-end gap-2 border-t border-stone/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-dark/40 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-stone/40"
          >
            Annuller
          </button>
          <button
            type="button"
            disabled={!fields.titel.trim()}
            onClick={() => {
              onSave(fields);
              onClose();
            }}
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-stone/60"
          >
            Opret opgave
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rediger-modal (eksisterende task) ────────────────────────────────────────

function EditTaskModal({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose: () => void;
  onSave: (updated: Partial<Task>) => void;
}) {
  const [fields, setFields] = useState<TaskFormFields>(fieldFromTask(task));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-lg rounded-2xl border border-stone/70 bg-plaster shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone/70 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Rediger opgave
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink/40 transition hover:text-ink"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <TaskFormBody fields={fields} onChange={setFields} />
        </div>

        <div className="flex items-center justify-between border-t border-stone/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-dark/40 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-stone/40"
          >
            Annuller
          </button>
          <button
            type="button"
            disabled={!fields.titel.trim()}
            onClick={() => {
              onSave({
                titel: fields.titel,
                projectSlug: fields.projectSlug,
                ansvarlige: fields.ansvarlige,
                prioritet: fields.prioritet,
                deadline: fields.deadline || undefined,
                noteHtml: fields.noteHtml || undefined,
              });
              onClose();
            }}
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-stone/60"
          >
            Opdater opgave
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drag-handle ikon ─────────────────────────────────────────────────────────

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="10" cy="4" r="1.2" />
      <circle cx="10" cy="8" r="1.2" />
      <circle cx="10" cy="12" r="1.2" />
    </svg>
  );
}

// ─── Opgavekort (indhold — bruges både direkte og i DragOverlay) ──────────────

function TaskCardInner({
  task,
  onUpdate,
  onEdit,
  isDragging = false,
  dragListeners,
  dragAttributes,
}: {
  task: Task;
  onUpdate: (id: string, s: TaskStatus) => void;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}) {
  const dl = getDeadlineState(task.deadline, task.status);
  const assignedPeople = people.filter((p) => task.ansvarlige.includes(p.id));

  return (
    <article
      className={`group relative cursor-pointer rounded-xl border border-stone/70 bg-white/90 p-3 shadow-sm transition ${
        isDragging ? "opacity-40" : "hover:border-stone-dark/60 hover:shadow-md"
      }`}
      onClick={isDragging ? undefined : () => onEdit(task)}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...(dragListeners ?? {})}
        {...(dragAttributes ?? {})}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1.5 top-3 hidden cursor-grab touch-none text-ink/25 hover:text-ink/55 group-hover:flex active:cursor-grabbing"
        aria-label="Træk opgave"
      >
        <DragHandleIcon />
      </button>

      <div className="flex items-start justify-between gap-2 pl-5">
        <p className="text-sm font-semibold leading-snug text-ink">
          {task.titel}
        </p>
        <span className="shrink-0 rounded-full bg-stone/60 px-2 py-0.5 text-[10px] font-medium text-ink/60">
          {areaLabel(task.projectSlug)}
        </span>
      </div>

      {task.beskrivelse && (
        <p className="mt-1 line-clamp-2 text-xs text-ink/55">
          {task.beskrivelse}
        </p>
      )}

      {task.noteHtml && (
        <p className="mt-1 flex items-center gap-1 text-[10px] text-ink/40">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 10Zm.75 2.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
              clipRule="evenodd"
            />
          </svg>
          Note tilknyttet
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <AvatarStack people={assignedPeople} />

          {task.deadline && (
            <span
              className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                dl?.type === "overskredet" || dl?.type === "snart"
                  ? "bg-terracotta/10 text-terracotta"
                  : "bg-stone/50 text-ink/60"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  dl?.type === "overskredet" || dl?.type === "snart"
                    ? "bg-terracotta"
                    : "bg-sage"
                }`}
              />
              {formatDeadline(task.deadline)}
              {dl?.type === "overskredet" && (
                <span className="font-semibold"> · Overskredet</span>
              )}
            </span>
          )}

          {task.prioritet === "akut" && (
            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-terracotta">
              Akut
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(task.id, getNextStatus(task.status));
          }}
          className="rounded-md bg-terracotta px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-terracotta-dark"
        >
          {task.status === "ikke-startet"
            ? "Start"
            : task.status === "i-gang"
              ? "Afslut"
              : "Genåbn"}
        </button>
      </div>
    </article>
  );
}

// ─── Draggable wrapper ────────────────────────────────────────────────────────

function DraggableTaskCard({
  task,
  onUpdate,
  onEdit,
}: {
  task: Task;
  onUpdate: (id: string, s: TaskStatus) => void;
  onEdit: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? undefined : "transform 200ms ease",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCardInner
        task={task}
        onUpdate={onUpdate}
        onEdit={onEdit}
        isDragging={isDragging}
        dragListeners={listeners as Record<string, unknown>}
        dragAttributes={attributes as unknown as Record<string, unknown>}
      />
    </div>
  );
}

// ─── Droppable kolonne ────────────────────────────────────────────────────────

function DroppableColumn({
  id,
  label,
  count,
  children,
}: {
  id: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border bg-plaster/60 transition-colors ${
        isOver ? "border-terracotta/60 bg-terracotta/5" : "border-stone/70"
      }`}
    >
      <div className="flex items-center justify-between border-b border-stone/70 px-4 py-3">
        <p className="font-display text-base font-semibold text-ink">{label}</p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            isOver
              ? "bg-terracotta/15 text-terracotta"
              : "bg-stone/70 text-ink/60"
          }`}
        >
          {count}
        </span>
      </div>
      <div className="space-y-3 p-3">
        {count === 0 ? (
          <div
            className={`rounded-xl border border-dashed p-4 text-center text-sm transition-colors ${
              isOver
                ? "border-terracotta/40 text-terracotta/60"
                : "border-stone-dark/30 text-ink/35"
            }`}
          >
            {isOver ? "Slip her" : "Ingen opgaver"}
          </div>
        ) : (
          <>
            {children}
            {isOver && (
              <div className="rounded-xl border border-dashed border-terracotta/40 p-2 text-center text-xs text-terracotta/60">
                Slip her
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ─── Listevisning-række ───────────────────────────────────────────────────────

function TaskRow({
  task,
  onUpdate,
  onEdit,
}: {
  task: Task;
  onUpdate: (id: string, s: TaskStatus) => void;
  onEdit: (task: Task) => void;
}) {
  const dl = getDeadlineState(task.deadline, task.status);
  const assignedPeople = people.filter((p) => task.ansvarlige.includes(p.id));

  return (
    <div
      className="flex cursor-pointer items-center gap-3 border-b border-stone/50 px-4 py-3 last:border-0 hover:bg-stone/20"
      onClick={() => onEdit(task)}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{task.titel}</p>
        <p className="text-xs text-ink/50">{areaLabel(task.projectSlug)}</p>
      </div>
      <AvatarStack people={assignedPeople} />
      {task.deadline && (
        <span
          className={`hidden rounded-md px-2 py-0.5 text-xs sm:block ${
            dl?.type === "overskredet" || dl?.type === "snart"
              ? "bg-terracotta/10 text-terracotta"
              : "bg-stone/50 text-ink/60"
          }`}
        >
          {formatDeadline(task.deadline)}
        </span>
      )}
      <span
        className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:block ${
          task.status === "afsluttet"
            ? "bg-sage/20 text-sage"
            : task.status === "i-gang"
              ? "bg-pine/15 text-pine"
              : "bg-stone/70 text-ink/60"
        }`}
      >
        {statusLabel(task.status)}
      </span>
      {task.noteHtml && (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 shrink-0 text-ink/30"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 10Zm.75 2.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpdate(task.id, getNextStatus(task.status));
        }}
        className="shrink-0 rounded-md bg-terracotta px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-terracotta-dark"
      >
        {task.status === "ikke-startet"
          ? "Start"
          : task.status === "i-gang"
            ? "Afslut"
            : "Genåbn"}
      </button>
    </div>
  );
}

// ─── Hoved-side ───────────────────────────────────────────────────────────────

type ViewMode = "board" | "list";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const nextIdRef = useRef(tasks.length + 1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;
    const targetStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.status === targetStatus) return;
    updateTaskStatus(task.id, targetStatus);
  }

  function updateTaskStatus(taskId: string, nextStatus: TaskStatus) {
    setTasks((curr) =>
      curr.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    );
  }

  function addTask(fields: TaskFormFields) {
    const newTask: Task = {
      id: `t${nextIdRef.current++}`,
      projectSlug: fields.projectSlug,
      titel: fields.titel,
      status: "ikke-startet",
      type: "uafklaret",
      prioritet: fields.prioritet,
      ansvarlige: fields.ansvarlige,
      deadline: fields.deadline || undefined,
      noteHtml: fields.noteHtml || undefined,
    };
    setTasks((curr) => [newTask, ...curr]);
  }

  function updateTask(taskId: string, changes: Partial<Task>) {
    setTasks((curr) =>
      curr.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
    );
  }

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPerson =
        !selectedPersonId || task.ansvarlige.includes(selectedPersonId);
      const matchesSearch =
        !searchQuery ||
        task.titel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPerson && matchesSearch;
    });
  }, [tasks, selectedPersonId, searchQuery]);

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => t.status !== "afsluttet").length;
  const doneCount = tasks.filter((t) => t.status === "afsluttet").length;
  const donePercent =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const upcomingDeadlines = tasks
    .filter((t) => t.deadline && t.status !== "afsluttet")
    .sort((a, b) => a.deadline!.localeCompare(b.deadline!))
    .slice(0, 5);

  const columns = statusOrder.map((status) => ({
    key: status,
    label: statusLabel(status),
    tasks: filtered.filter((t) => t.status === status),
  }));

  return (
    <>
      {showNewModal && (
        <NewTaskModal onClose={() => setShowNewModal(false)} onSave={addTask} />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(changes) => {
            updateTask(editingTask.id, changes);
            setEditingTask(null);
          }}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-terracotta">
              Husrenovering
            </p>
            <h1 className="font-display text-3xl font-semibold text-ink">
              Opgaver
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Ny opgave
          </button>
        </div>

        {/* Widget-række */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone/70 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Samlet antal tasks
            </p>
            <p className="mt-1 font-display text-5xl font-semibold text-ink">
              {totalCount}
            </p>
            <p className="mt-1 text-xs text-ink/50">
              {activeCount} aktive · {doneCount} afsluttet
            </p>
          </div>

          <div className="rounded-2xl border border-stone/70 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Fremgang
            </p>
            <p className="mt-1 font-display text-5xl font-semibold text-sage">
              {donePercent}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone/60">
              <div
                className="h-full rounded-full bg-sage transition-all"
                style={{ width: `${donePercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-ink/50">færdige</p>
          </div>

          <div className="rounded-2xl border border-stone/70 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Per person
            </p>
            <div className="mt-3 space-y-3">
              {people.map((person) => {
                const pActive = tasks.filter(
                  (t) =>
                    t.ansvarlige.includes(person.id) &&
                    t.status !== "afsluttet",
                ).length;
                const pDone = tasks.filter(
                  (t) =>
                    t.ansvarlige.includes(person.id) &&
                    t.status === "afsluttet",
                ).length;
                const pTotal = pActive + pDone;
                const pPercent =
                  pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;
                return (
                  <div key={person.id}>
                    <div className="flex items-center gap-2">
                      <Avatar person={person} size="md" />
                      <span className="flex-1 text-xs font-medium text-ink">
                        {person.navn}
                      </span>
                      <span className="text-[10px] text-ink/50">
                        {pDone}/{pTotal}
                      </span>
                    </div>
                    <div className="ml-8 mt-1 h-1.5 overflow-hidden rounded-full bg-stone/60">
                      <div
                        className="h-full rounded-full bg-pine/60"
                        style={{ width: `${pPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-stone/70 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Kommende deadlines
            </p>
            <div className="mt-3 space-y-2">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-ink/40">Ingen kommende deadlines</p>
              ) : (
                upcomingDeadlines.map((t) => {
                  const dl = getDeadlineState(t.deadline, t.status);
                  return (
                    <div
                      key={t.id}
                      className="flex items-start justify-between gap-1"
                    >
                      <p className="line-clamp-1 text-xs text-ink/80">
                        {t.titel}
                      </p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          dl?.type === "overskredet" || dl?.type === "snart"
                            ? "bg-terracotta/10 text-terracotta"
                            : "bg-stone/50 text-ink/60"
                        }`}
                      >
                        {formatDeadline(t.deadline!)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone/70 bg-white/50 px-4 py-3">
          <div className="relative w-full max-w-xs">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg i opgaver…"
              className="w-full rounded-lg border border-stone-dark/40 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedPersonId(null)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedPersonId === null
                    ? "bg-terracotta text-white"
                    : "bg-stone/70 text-ink/70 hover:bg-stone"
                }`}
              >
                Alle
              </button>
              {people.map((person) => {
                const active = selectedPersonId === person.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() =>
                      setSelectedPersonId(active ? null : person.id)
                    }
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? "border-terracotta bg-terracotta/10 text-ink"
                        : "border-stone-dark/40 text-ink/70 hover:bg-stone/40"
                    }`}
                  >
                    <Avatar person={person} size="sm" />
                    {person.navn}
                  </button>
                );
              })}
            </div>

            <div className="flex rounded-lg border border-stone-dark/40 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "board"
                    ? "bg-terracotta text-white"
                    : "text-ink/60 hover:bg-stone/30"
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H7a2.5 2.5 0 0 1 2.5 2.5V7A2.5 2.5 0 0 1 7 9.5H4.5A2.5 2.5 0 0 1 2 7V4.5ZM2 13a2.5 2.5 0 0 1 2.5-2.5H7A2.5 2.5 0 0 1 9.5 13v2.5A2.5 2.5 0 0 1 7 18H4.5A2.5 2.5 0 0 1 2 15.5V13ZM10.5 4.5A2.5 2.5 0 0 1 13 2h2.5A2.5 2.5 0 0 1 18 4.5V7a2.5 2.5 0 0 1-2.5 2.5H13A2.5 2.5 0 0 1 10.5 7V4.5ZM10.5 13a2.5 2.5 0 0 1 2.5-2.5h2.5A2.5 2.5 0 0 1 18 13v2.5A2.5 2.5 0 0 1 15.5 18H13a2.5 2.5 0 0 1-2.5-2.5V13Z" />
                </svg>
                Bræt
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-r-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "list"
                    ? "bg-terracotta text-white"
                    : "text-ink/60 hover:bg-stone/30"
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Indhold */}
        {viewMode === "board" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid gap-4 xl:grid-cols-3">
              {columns.map((col) => (
                <DroppableColumn
                  key={col.key}
                  id={col.key}
                  label={col.label}
                  count={col.tasks.length}
                >
                  {col.tasks.map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTaskStatus}
                      onEdit={setEditingTask}
                    />
                  ))}
                </DroppableColumn>
              ))}
            </div>

            <DragOverlay
              dropAnimation={{
                duration: 180,
                easing: "cubic-bezier(0.18,0.67,0.6,1.22)",
              }}
            >
              {activeTaskId &&
                (() => {
                  const t = tasks.find((x) => x.id === activeTaskId);
                  if (!t) return null;
                  return (
                    <div
                      style={{
                        transform: "rotate(1.5deg)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <TaskCardInner
                        task={t}
                        onUpdate={() => {}}
                        onEdit={() => {}}
                      />
                    </div>
                  );
                })()}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone/70 bg-white/70">
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink/40">
                Ingen opgaver matcher filteret
              </p>
            ) : (
              filtered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onUpdate={updateTaskStatus}
                  onEdit={setEditingTask}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
