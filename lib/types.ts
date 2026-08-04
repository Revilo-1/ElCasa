// Datamodel for Tværstræde-projektet.
// Disse typer bruges af mock-data nu, og af Supabase-klienten senere –
// så UI-komponenterne behøver ikke ændres, når vi skifter datakilde.

export type Area =
  | "koekken"
  | "bad"
  | "kaelder"
  | "have"
  | "facade-tag"
  | "energi"
  | "planloesning";

export interface Project {
  slug: Area;
  navn: string;
  beskrivelse: string;
  // Til det arkitektoniske "grundplan"-udtryk i UI'en
  ikon: "koekken" | "bad" | "kaelder" | "have" | "tag" | "energi" | "plan";
}

export type TaskStatus = "ikke-startet" | "i-gang" | "afsluttet";
export type TaskType = "diy" | "haandvaerker" | "uafklaret";
export type TaskPriority = "akut" | "normal" | "engang";

export interface Person {
  id: string;
  navn: string;
  initialer: string;
}

export interface Task {
  id: string;
  projectSlug: Area;
  titel: string;
  beskrivelse?: string;
  status: TaskStatus;
  type: TaskType;
  prioritet: TaskPriority;
  ansvarlig?: string; // Person.id
  deadline?: string; // ISO-dato, valgfri
  boernesikkerhed?: boolean; // flag hvis relevant iht. projektinstruksen
  // Kobling til budgetlinjer for denne opgave
  budgetPostId?: string;
}

export interface BudgetPost {
  id: string;
  projectSlug: Area;
  navn: string;
  estimatDiy?: number; // kr.
  estimatHaandvaerker?: number; // kr.
  faktiskPris?: number; // kr., udfyldes når posten er betalt
  status: "estimat" | "bestilt" | "betalt";
  note?: string;
}

// Penge der kommer IND i projektet - fx forsikringsudbetaling eller salg af
// gamle hvidevarer/inventar i forbindelse med en renovering.
export interface Income {
  id: string;
  navn: string;
  beloeb: number; // kr.
  dato?: string; // ISO-dato
  note?: string;
}
