# Tværstræde 12 – Projektoverblik

Internt værktøj til at holde styr på opgaver og budget for renoveringen af
Tværstræde 12. Bygget som en Next.js-webapp, så den virker ens på computer
og iPhone (kan "installeres" på hjemskærmen).

## Kom i gang

Kræver [Node.js](https://nodejs.org) 18+ installeret.

```bash
npm install
npm run dev
```

Åbn <http://localhost:3000>. Siden bruger lige nu **mock-data** (ingen
database eller konto nødvendig) – se `lib/mock-data.ts`.

## Projektstruktur

```
app/
  page.tsx                 -> Dashboard (overblik over alle delprojekter)
  projects/[slug]/page.tsx -> Ét delprojekt (fx "Have") med opgaver + budget
  layout.tsx               -> Overordnet skelet, fonte, sidebar
  globals.css               -> Farver, typografi, signatur-elementet

components/                -> Genbrugelige UI-dele (opgaveliste, budgettabel, ...)

lib/
  types.ts                 -> Datamodellen (Project, Task, BudgetPost, Person)
  mock-data.ts              -> De faktiske testdata siden viser lige nu
  data.ts                   -> Data-adgangslag - ÉN fil at ændre, når Supabase kobles på
```

**Design-tanken:** Alt UI kalder funktioner fra `lib/data.ts`
(`getTasks()`, `getBudgetPosts()`, osv.) i stedet for at læse fra
`mock-data.ts` direkte. Det betyder, at når databasen kobles på, er det kun
`lib/data.ts`, der skal ændres - ingen af siderne eller komponenterne.

## Farvepalet og typografi

Paletten er hentet fra husets egne materialer, så det føles som "jeres hus",
ikke et generisk skabelon-værktøj:

- `terracotta` – gulvfliserne i køkken/entré
- `pine` – dørtræet
- `sage` – hækken/haven
- `stone` – travertin-fliserne i badeværelset
- `plaster` / `ink` – kalkede vægge og mørkt træ

Se `tailwind.config.ts` for de præcise værdier.

## Roadmap – næste faser

Dette er **fase 1** (UI + mock-data). Planen herfra:

1. **Fase 1 – UI-skelet** ✅ (det du kigger på nu)
2. **Fase 2 – Supabase**: opret projekt på [supabase.com](https://supabase.com),
   kør SQL'en for tabellerne (`projects`, `tasks`, `budget_posts`, `people`) svarende
   til typerne i `lib/types.ts`, udfyld `.env.local` (se `.env.local.example`), og
   erstat funktionerne i `lib/data.ts` med rigtige Supabase-kald.
3. **Fase 3 – Login**: Supabase Auth, så flere personer kan logge ind og få
   opgaver tildelt.
4. **Fase 4 – Notifikationer**: start med e-mail (fx via Zapier, når en opgave
   tildeles eller status ændres), evt. web push-notifikationer senere (iOS
   understøtter det via Safari siden 16.4, hvis siden er lagt til hjemskærmen).
5. **Fase 5 – Deploy**: forbind GitHub-repoet til [Vercel](https://vercel.com)
   (gratis) for automatisk deploy ved hver push til `main`.

## Installér på iPhone-hjemskærm

Når siden er deployet (fase 5): åbn den i Safari på iPhone → Del-ikon →
"Føj til hjemmeskærm". Den åbner herefter uden browser-UI, som en rigtig app.
