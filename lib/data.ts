// Data-adgangslag.
//
// Lige nu læser funktionerne herunder fra mock-data i hukommelsen.
// Når Supabase kobles på senere, er det KUN denne fil, der skal ændres –
// alle sider og komponenter kalder disse funktioner og er ligeglade med,
// om data kommer fra en array eller en rigtig database.
//
// Eksempel på hvordan getProjects() vil se ud med Supabase:
//
//   export async function getProjects() {
//     const { data, error } = await supabase.from("projects").select("*");
//     if (error) throw error;
//     return data;
//   }

import {
  budgetPosts,
  incomes,
  people,
  projects,
  tasks,
  totalBudget,
} from "./mock-data";
import { Area, BudgetPost, Income, Person, Project, Task } from "./types";
import { createSupabaseServerClient, hasSupabaseEnv } from "./supabase";
import { unstable_noStore as noStore } from "next/cache";

type IncomeRow = {
  id: string;
  navn: string;
  beloeb: number;
  dato: string | null;
  note: string | null;
};

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProject(slug: Area): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function getTasks(slug?: Area): Promise<Task[]> {
  if (!slug) return tasks;
  return tasks.filter((t) => t.projectSlug === slug);
}

export async function getBudgetPosts(slug?: Area): Promise<BudgetPost[]> {
  if (!slug) return budgetPosts;
  return budgetPosts.filter((b) => b.projectSlug === slug);
}

export async function getPeople(): Promise<Person[]> {
  return people;
}

export async function getIncomes(): Promise<Income[]> {
  noStore();

  if (!hasSupabaseEnv()) {
    return incomes;
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("incomes")
      .select("id, navn, beloeb, dato, note")
      .order("dato", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Kunne ikke hente indtægter fra Supabase:", error.message);
      return incomes;
    }

    return (data as IncomeRow[]).map((row) => ({
      id: row.id,
      navn: row.navn,
      beloeb: row.beloeb,
      dato: row.dato ?? undefined,
      note: row.note ?? undefined,
    }));
  } catch (error) {
    console.error("Uventet fejl ved hentning af indtægter:", error);
    return incomes;
  }
}

export async function addIncome(input: {
  navn: string;
  beloeb: number;
  dato?: string;
  note?: string;
}) {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase er ikke konfigureret endnu.");
  }

  const navn = input.navn.trim();
  const note = input.note?.trim();

  if (!navn) {
    throw new Error("Navn er påkrævet.");
  }

  if (!Number.isFinite(input.beloeb) || input.beloeb < 0) {
    throw new Error("Beløb skal være et gyldigt tal.");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("incomes").insert({
    navn,
    beloeb: Math.round(input.beloeb),
    dato: input.dato || null,
    note: note || null,
  });

  if (error) {
    throw new Error(`Kunne ikke gemme indtægt: ${error.message}`);
  }
}

export async function getTotalBudget(): Promise<number> {
  return totalBudget;
}

// --- Afledte tal, som UI'en bruger til overbliksvisningen ---

export function summarizeBudget(posts: BudgetPost[]) {
  const estimatLavt = posts.reduce(
    (sum, p) => sum + (p.estimatDiy ?? p.estimatHaandvaerker ?? 0),
    0,
  );
  const estimatHoejt = posts.reduce(
    (sum, p) => sum + (p.estimatHaandvaerker ?? p.estimatDiy ?? 0),
    0,
  );
  const faktisk = posts.reduce((sum, p) => sum + (p.faktiskPris ?? 0), 0);
  return { estimatLavt, estimatHoejt, faktisk };
}

export function summarizeTasks(taskList: Task[]) {
  const total = taskList.length;
  const afsluttet = taskList.filter((t) => t.status === "afsluttet").length;
  const iGang = taskList.filter((t) => t.status === "i-gang").length;
  const procent = total === 0 ? 0 : Math.round((afsluttet / total) * 100);
  return { total, afsluttet, iGang, procent };
}

// Til "Budget Oversigt"-siden: nøgletal på tværs af hele projektet.
export function summarizeBudgetOverview(
  posts: BudgetPost[],
  budgetRamme: number,
) {
  const estimeredeUdgifter = posts.reduce(
    (sum, p) => sum + (p.estimatDiy ?? p.estimatHaandvaerker ?? 0),
    0,
  );
  const tilbage = budgetRamme - estimeredeUdgifter;
  const procentBrugt =
    budgetRamme === 0
      ? 0
      : Math.round((estimeredeUdgifter / budgetRamme) * 100);
  return {
    budgetRamme,
    estimeredeUdgifter,
    tilbage,
    procentBrugt,
    antalPoster: posts.length,
  };
}

// Til opgave-widget'en: hvad kræver opmærksomhed lige nu, på tværs af rum.
export function summarizeTasksOverview(taskList: Task[]) {
  const idag = new Date();
  const totrekUger = new Date();
  totrekUger.setDate(idag.getDate() + 14);

  const akutte = taskList.filter(
    (t) => t.prioritet === "akut" && t.status !== "afsluttet",
  );
  const iGang = taskList.filter((t) => t.status === "i-gang");
  const snartDeadline = taskList.filter((t) => {
    if (!t.deadline || t.status === "afsluttet") return false;
    const d = new Date(t.deadline);
    return d >= idag && d <= totrekUger;
  });

  // De mest presserende opgaver samlet - til en kort liste i widget'en
  const prioriteret = [...akutte, ...snartDeadline, ...iGang]
    .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
    .slice(0, 5);

  return { akutte, iGang, snartDeadline, prioriteret };
}
