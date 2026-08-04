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

import { budgetPosts, people, projects, tasks } from "./mock-data";
import { Area, BudgetPost, Person, Project, Task } from "./types";

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

// --- Afledte tal, som UI'en bruger til overbliksvisningen ---

export function summarizeBudget(posts: BudgetPost[]) {
  const estimatLavt = posts.reduce(
    (sum, p) => sum + (p.estimatDiy ?? p.estimatHaandvaerker ?? 0),
    0
  );
  const estimatHoejt = posts.reduce(
    (sum, p) => sum + (p.estimatHaandvaerker ?? p.estimatDiy ?? 0),
    0
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
