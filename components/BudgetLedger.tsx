"use client";

import { FormEvent, useMemo, useState } from "react";
import { Area, BudgetPost, Project } from "@/lib/types";

const emptyForm: {
  navn: string;
  projectSlug: Area;
  estimatDiy: string;
  estimatHaandvaerker: string;
  faktiskPris: string;
  status: BudgetPost["status"];
  note: string;
} = {
  navn: "",
  projectSlug: "have",
  estimatDiy: "",
  estimatHaandvaerker: "",
  faktiskPris: "",
  status: "estimat",
  note: "",
};

export default function BudgetLedger({
  posts,
  projects,
}: {
  posts: BudgetPost[];
  projects: Project[];
}) {
  const [entries, setEntries] = useState(posts);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: project.slug,
        label: project.navn,
      })),
    [projects],
  );

  const createPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.navn.trim();
    if (!trimmedName) return;

    const nextPost: BudgetPost = {
      id: `local-${Date.now()}`,
      projectSlug: form.projectSlug,
      navn: trimmedName,
      estimatDiy: form.estimatDiy ? Number(form.estimatDiy) : undefined,
      estimatHaandvaerker: form.estimatHaandvaerker
        ? Number(form.estimatHaandvaerker)
        : undefined,
      faktiskPris: form.faktiskPris ? Number(form.faktiskPris) : undefined,
      status: form.status,
      note: form.note.trim() || undefined,
    };

    setEntries((current) => [nextPost, ...current]);
    setForm(emptyForm);
    setIsOpen(false);
  };

  const renderForm = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/25 p-3 sm:items-center">
      <div className="w-full max-w-xl rounded-lg border border-stone/70 bg-plaster p-4 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-lg font-semibold text-ink">
              Ny udgift
            </h4>
            <p className="text-sm text-ink/60">
              Tilføj en ny budgetpost til oversigten.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md border border-stone/70 px-2.5 py-1.5 text-xs font-medium text-ink/70"
          >
            Luk
          </button>
        </div>

        <form onSubmit={createPost} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm text-ink/70">
              <span className="mb-1 block">Postnavn</span>
              <input
                value={form.navn}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    navn: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
                placeholder="Eksempel: Træværk"
                required
              />
            </label>

            <label className="text-sm text-ink/70">
              <span className="mb-1 block">Område</span>
              <select
                value={form.projectSlug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    projectSlug: event.target.value as Area,
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
              >
                {projectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-ink/70">
              <span className="mb-1 block">DIY-estimat</span>
              <input
                type="number"
                inputMode="numeric"
                value={form.estimatDiy}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    estimatDiy: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
                placeholder="0"
              />
            </label>

            <label className="text-sm text-ink/70">
              <span className="mb-1 block">Håndværker-estimat</span>
              <input
                type="number"
                inputMode="numeric"
                value={form.estimatHaandvaerker}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    estimatHaandvaerker: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
                placeholder="0"
              />
            </label>

            <label className="text-sm text-ink/70">
              <span className="mb-1 block">Faktisk pris</span>
              <input
                type="number"
                inputMode="numeric"
                value={form.faktiskPris}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    faktiskPris: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
                placeholder="0"
              />
            </label>

            <label className="text-sm text-ink/70">
              <span className="mb-1 block">Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as BudgetPost["status"],
                  }))
                }
                className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
              >
                <option value="estimat">Estimat</option>
                <option value="bestilt">Bestilt</option>
                <option value="betalt">Betalt</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-ink/70">
            <span className="mb-1 block">Note</span>
            <textarea
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              rows={3}
              className="w-full rounded-md border border-stone/70 bg-white/60 px-3 py-2 outline-none"
              placeholder="Kort note om posten"
            />
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-stone/70 px-3 py-2 text-sm font-medium text-ink/80"
            >
              Annullér
            </button>
            <button
              type="submit"
              className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-plaster"
            >
              Gem udgift
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            Alle budgetposter
          </h3>
          {entries.length === 0 && (
            <p className="mt-1 text-sm text-ink/50">
              Ingen udgiftsposter endnu.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex w-fit items-center rounded-md border border-stone/70 bg-white/40 px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-stone/40"
        >
          Ny udgift
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-stone-dark/40 bg-white/30 px-4 py-8 text-center text-sm text-ink/50">
          Ingen udgiftsposter endnu. Brug knappen ovenfor til at tilføje den
          første.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone/70">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone/70 bg-stone/20 text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-2.5 font-medium">Post</th>
                <th className="px-4 py-2.5 font-medium">Område</th>
                <th className="px-4 py-2.5 font-medium">DIY-estimat</th>
                <th className="px-4 py-2.5 font-medium">Håndværker-estimat</th>
                <th className="px-4 py-2.5 font-medium">Faktisk pris</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/50">
              {entries.map((post) => {
                const project = projects.find(
                  (p) => p.slug === post.projectSlug,
                );
                return (
                  <tr key={post.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{post.navn}</p>
                      {post.note && (
                        <p className="mt-0.5 text-xs text-ink/50">
                          {post.note}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{project?.navn}</td>
                    <td className="px-4 py-3 font-mono text-ink/80">
                      {post.estimatDiy
                        ? `${post.estimatDiy.toLocaleString("da-DK")} kr.`
                        : "–"}
                    </td>
                    <td className="px-4 py-3 font-mono text-ink/80">
                      {post.estimatHaandvaerker
                        ? `${post.estimatHaandvaerker.toLocaleString("da-DK")} kr.`
                        : "–"}
                    </td>
                    <td className="px-4 py-3 font-mono text-ink/80">
                      {post.faktiskPris
                        ? `${post.faktiskPris.toLocaleString("da-DK")} kr.`
                        : "–"}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{post.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && renderForm()}
    </div>
  );
}
