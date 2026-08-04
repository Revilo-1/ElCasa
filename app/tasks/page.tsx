"use client";

import { useMemo, useState } from "react";
import { people, projects, tasks as initialTasks } from "@/lib/mock-data";
import { Area, Person, Task, TaskStatus } from "@/lib/types";
import AvatarStack from "@/components/AvatarStack";

const groupOptions = [
  { key: "status", label: "Status" },
  { key: "area", label: "Rum" },
  { key: "person", label: "Ansvarlig" },
] as const;

const statusOrder: TaskStatus[] = ["ikke-startet", "i-gang", "afsluttet"];
const areaOrder: Area[] = projects.map((project) => project.slug);
const peopleOrder = people;

function getDeadlineState(deadline?: string, status?: TaskStatus) {
  if (!deadline || status === "afsluttet") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0)
    return { type: "overskredet" as const, label: "Overskredet" };
  if (diffDays <= 14)
    return { type: "snart" as const, label: `${diffDays} dage` };
  return { type: "normal" as const, label: `${diffDays} dage` };
}

function formatDeadline(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
}

function statusLabel(status: TaskStatus) {
  return {
    "ikke-startet": "Ikke startet",
    "i-gang": "I gang",
    afsluttet: "Afsluttet",
  }[status];
}

function areaLabel(slug: Area) {
  return projects.find((project) => project.slug === slug)?.navn ?? slug;
}

function personLabel(id: string) {
  return people.find((person) => person.id === id)?.navn ?? id;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [groupBy, setGroupBy] =
    useState<(typeof groupOptions)[number]["key"]>("status");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const peopleById = useMemo(
    () => Object.fromEntries(people.map((person) => [person.id, person])),
    [],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!selectedPersonId) return true;
      return (
        task.ansvarlige.includes(selectedPersonId) ||
        (task.ansvarlige.length === 2 &&
          task.ansvarlige.includes(selectedPersonId))
      );
    });
  }, [selectedPersonId, tasks]);

  const groupedTasks = useMemo(() => {
    const buckets = new Map<string, Task[]>();

    filteredTasks.forEach((task) => {
      let key = "";
      let groupLabel = "";

      if (groupBy === "status") {
        key = task.status;
        groupLabel = statusLabel(task.status);
      }

      if (groupBy === "area") {
        key = task.projectSlug;
        groupLabel = areaLabel(task.projectSlug);
      }

      if (groupBy === "person") {
        if (task.ansvarlige.length === 2) {
          key = "fælles";
          groupLabel = "Fælles";
        } else if (task.ansvarlige.length === 1) {
          key = task.ansvarlige[0];
          groupLabel = personLabel(task.ansvarlige[0]);
        } else {
          key = "ikke-tildelt";
          groupLabel = "Ikke tildelt";
        }
      }

      buckets.set(key, [...(buckets.get(key) ?? []), task]);
      buckets.get(key)?.sort((a, b) => a.titel.localeCompare(b.titel));
    });

    const orderedGroups: Array<{ key: string; label: string; tasks: Task[] }> =
      [];

    if (groupBy === "status") {
      for (const status of statusOrder) {
        const list = buckets.get(status) ?? [];
        if (list.length > 0)
          orderedGroups.push({
            key: status,
            label: statusLabel(status),
            tasks: list,
          });
      }
    }

    if (groupBy === "area") {
      for (const area of areaOrder) {
        const list = buckets.get(area) ?? [];
        if (list.length > 0)
          orderedGroups.push({
            key: area,
            label: areaLabel(area),
            tasks: list,
          });
      }
    }

    if (groupBy === "person") {
      for (const person of peopleOrder) {
        const list = buckets.get(person.id) ?? [];
        if (list.length > 0)
          orderedGroups.push({
            key: person.id,
            label: person.navn,
            tasks: list,
          });
      }

      const common = buckets.get("fælles") ?? [];
      if (common.length > 0)
        orderedGroups.push({ key: "fælles", label: "Fælles", tasks: common });

      const unassigned = buckets.get("ikke-tildelt") ?? [];
      if (unassigned.length > 0)
        orderedGroups.push({
          key: "ikke-tildelt",
          label: "Ikke tildelt",
          tasks: unassigned,
        });
    }

    return orderedGroups;
  }, [filteredTasks, groupBy]);

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }

  function updateTaskStatus(taskId: string, nextStatus: TaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    );
  }

  function toggleGroupCollapse(groupKey: string) {
    setCollapsedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }));
  }

  function bulkMarkDone() {
    setTasks((current) =>
      current.map((task) =>
        selectedTaskIds.includes(task.id)
          ? { ...task, status: "afsluttet" }
          : task,
      ),
    );
  }

  function clearSelection() {
    setSelectedTaskIds([]);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-terracotta">
            Husrenovering
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Task-bræt
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Interaktivt overblik over opgaver, status og ansvar. Siden er lokalt
            for nuværende og kan senere kobles til Supabase.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink/60">Gruppér efter:</span>
            {groupOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setGroupBy(option.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  groupBy === option.key
                    ? "bg-terracotta text-white"
                    : "bg-stone/70 text-ink/70 hover:bg-stone"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {people.map((person) => {
              const isActive = selectedPersonId === person.id;
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() =>
                    setSelectedPersonId(isActive ? null : person.id)
                  }
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-terracotta bg-terracotta/10 text-ink"
                      : "border-stone-dark/40 text-ink/70 hover:bg-stone/40"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pine/20 font-mono text-[10px]">
                    {person.initialer}
                  </span>
                  {person.navn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-stone/70 bg-white/40 p-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink/60">Valgte:</span>
          <span className="font-medium text-ink">{selectedTaskIds.length}</span>
          <button
            type="button"
            onClick={bulkMarkDone}
            disabled={selectedTaskIds.length === 0}
            className="rounded-md bg-sage px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone/60"
          >
            Marker som afsluttet
          </button>
          <button
            type="button"
            onClick={clearSelection}
            disabled={selectedTaskIds.length === 0}
            className="rounded-md border border-stone-dark/40 px-3 py-1.5 text-xs font-semibold text-ink/70 disabled:cursor-not-allowed disabled:text-ink/35"
          >
            Nulstil valg
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {groupedTasks.map((group) => {
          const isCollapsed = collapsedGroups[group.key];
          const total = group.tasks.length;

          return (
            <section
              key={group.key}
              className="rounded-xl border border-stone/70 bg-plaster/60"
            >
              <button
                type="button"
                onClick={() => toggleGroupCollapse(group.key)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-display text-base font-semibold text-ink">
                  {group.label}
                </span>
                <span className="rounded-full bg-stone/70 px-2.5 py-0.5 text-xs font-medium text-ink/70">
                  {total}
                </span>
              </button>

              {!isCollapsed && (
                <div className="border-t border-stone/70">
                  {group.tasks.map((task) => {
                    const deadlineInfo = getDeadlineState(
                      task.deadline,
                      task.status,
                    );
                    const assignedPeople = people.filter((person) =>
                      task.ansvarlige.includes(person.id),
                    );
                    const roomTag =
                      groupBy !== "area" ? (
                        <span className="rounded-full bg-stone/60 px-2 py-0.5 text-[10px] font-medium text-ink/70">
                          {areaLabel(task.projectSlug)}
                        </span>
                      ) : null;

                    return (
                      <div
                        key={task.id}
                        className="flex flex-col gap-3 border-b border-stone/50 px-4 py-3 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTaskIds.includes(task.id)}
                            onChange={() => toggleTaskSelection(task.id)}
                            className="mt-1 h-4 w-4 rounded border-stone-dark/60"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-medium text-ink">
                                {task.titel}
                              </p>
                              {roomTag}
                            </div>
                            {task.beskrivelse && (
                              <p className="mt-1 text-xs text-ink/55">
                                {task.beskrivelse}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="ml-7 flex flex-wrap items-center gap-2">
                          <AvatarStack people={assignedPeople} />

                          <select
                            value={task.status}
                            onChange={(event) =>
                              updateTaskStatus(
                                task.id,
                                event.target.value as TaskStatus,
                              )
                            }
                            className="rounded-md border border-stone-dark/40 bg-white px-2.5 py-1 text-xs text-ink"
                          >
                            {statusOrder.map((status) => (
                              <option key={status} value={status}>
                                {statusLabel(status)}
                              </option>
                            ))}
                          </select>

                          {task.deadline && (
                            <div className="flex items-center gap-2 rounded-md bg-white/70 px-2.5 py-1 text-xs">
                              <span
                                className={`inline-flex h-2 w-2 rounded-full ${
                                  deadlineInfo?.type === "overskredet"
                                    ? "bg-terracotta"
                                    : deadlineInfo?.type === "snart"
                                      ? "bg-terracotta"
                                      : "bg-sage"
                                }`}
                              />
                              <span
                                className={
                                  deadlineInfo?.type === "overskredet"
                                    ? "font-semibold text-terracotta"
                                    : "text-ink/60"
                                }
                              >
                                {formatDeadline(task.deadline)}
                              </span>
                              {deadlineInfo?.type === "overskredet" && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-terracotta">
                                  Overskredet
                                </span>
                              )}
                              {deadlineInfo?.type === "snart" && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-terracotta">
                                  Snart
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
