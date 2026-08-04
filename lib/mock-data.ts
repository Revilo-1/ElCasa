import { Area, BudgetPost, Income, Person, Project, Task } from "./types";

// Den samlede budgetramme for hele projektet, sat over flere år.
// Justér dette tal til jeres faktiske ramme - det er bevidst ikke afledt
// af noget andet, så det er let at ændre ét sted.
export const totalBudget = 350_000;

// --- Delprojekter (de 7 indsatsområder fra projektinstruksen) ---
export const projects: Project[] = [
  {
    slug: "koekken",
    navn: "Køkken",
    beskrivelse: "Renovering af køkken – layout, hvidevarer, finish.",
    ikon: "koekken",
  },
  {
    slug: "bad",
    navn: "Badeværelse(r)",
    beskrivelse: "Bad i stue + bad i kælder.",
    ikon: "bad",
  },
  {
    slug: "kaelder",
    navn: "Kælder / disponibelt værelse",
    beskrivelse: "90 m² kælder med egen indgang.",
    ikon: "kaelder",
  },
  {
    slug: "have",
    navn: "Have / terrasse / udearealer",
    beskrivelse: "Indkørsel, låge, plæne, terrasse.",
    ikon: "have",
  },
  {
    slug: "facade-tag",
    navn: "Facade / tag / klimaskærm",
    beskrivelse: "Ydre klimaskærm og vedligehold.",
    ikon: "tag",
  },
  {
    slug: "energi",
    navn: "Energi",
    beskrivelse: "Isolering, varmepumpe, vinduer. Energimærke D i dag.",
    ikon: "energi",
  },
  {
    slug: "planloesning",
    navn: "Indretning / planløsning",
    beskrivelse: "Generel disponering af rum og flow.",
    ikon: "plan",
  },
];

// --- Personer (tilpas til de faktiske involverede) ---
export const people: Person[] = [
  { id: "oliver", navn: "Oliver", initialer: "OL" },
  { id: "person2", navn: "Partner", initialer: "PP" },
];

// --- Opgaver, sat med udgangspunkt i det, der allerede er drøftet ---
export const tasks: Task[] = [
  {
    id: "t1",
    projectSlug: "have",
    titel: "Fastlæg lågeåbningens bredde",
    beskrivelse:
      "Afklar bredde for dobbeltfløjet led ved indkørslen, så budget kan låses.",
    status: "i-gang",
    type: "uafklaret",
    prioritet: "normal",
    ansvarlige: ["oliver", "person2"],
    deadline: "2026-08-15",
    budgetPostId: "b1",
  },
  {
    id: "t2",
    projectSlug: "have",
    titel: "Byg manuel dobbeltfløjet trælåge",
    beskrivelse: "Start manuelt – automatisering kan eftermonteres senere.",
    status: "ikke-startet",
    type: "diy",
    prioritet: "normal",
    ansvarlige: ["oliver"],
    budgetPostId: "b1",
  },
  {
    id: "t3",
    projectSlug: "have",
    titel: "Tjek Hegnsloven og indkørselsregler",
    beskrivelse:
      "Højdebegrænsninger, oversigtsforhold ved udkørsel til vej, lokalplan.",
    status: "ikke-startet",
    type: "uafklaret",
    prioritet: "normal",
    ansvarlige: ["oliver"],
  },
  {
    id: "t4",
    projectSlug: "have",
    titel: "Jordprøve + kalkning af plænen",
    status: "ikke-startet",
    type: "diy",
    prioritet: "normal",
    ansvarlige: ["person2"],
    budgetPostId: "b2",
  },
  {
    id: "t5",
    projectSlug: "have",
    titel: "Bekræft plæneklippertype",
    beskrivelse:
      "Afgør om der skal købes rullesæt til eksisterende klipper, eller ny klipper med indbygget rulle.",
    status: "ikke-startet",
    type: "uafklaret",
    prioritet: "normal",
    ansvarlige: ["person2"],
  },
  {
    id: "t6",
    projectSlug: "energi",
    titel: "Indhent tilstandsrapport / byggesagkyndig vurdering",
    beskrivelse:
      "Ingen rapport indhentet endnu – godt fundament for resten af projektet.",
    status: "ikke-startet",
    type: "haandvaerker",
    prioritet: "akut",
    ansvarlige: [],
    deadline: "2026-08-20",
  },
  {
    id: "t7",
    projectSlug: "koekken",
    titel: "Vælg overordnet stilretning for huset",
    beskrivelse:
      "Klassisk, moderne eller skandinavisk – afklares før større valg.",
    status: "ikke-startet",
    type: "uafklaret",
    prioritet: "normal",
    ansvarlige: ["oliver", "person2"],
  },
];

// --- Budgetposter, koblet til opgaverne ovenfor ---
export const budgetPosts: BudgetPost[] = [
  {
    id: "b1",
    projectSlug: "have",
    navn: "Manuel dobbeltfløjet trælåge (materialer)",
    estimatDiy: 5500,
    estimatHaandvaerker: 18000,
    status: "estimat",
    note: "Automatisering kan eftermonteres – ikke medregnet endnu.",
  },
  {
    id: "b2",
    projectSlug: "have",
    navn: "Plænepleje (kalk, gødning, eftersåning)",
    estimatDiy: 1200,
    status: "estimat",
  },
];

// --- Indtægter/refusioner ind i projektet (valgfrit at bruge) ---
export const incomes: Income[] = [
  {
    id: "i1",
    navn: "Salg af gammelt komfur",
    beloeb: 800,
    dato: "2026-07-20",
    note: "Solgt via DBA i forbindelse med køkkenplanlægning.",
  },
];
