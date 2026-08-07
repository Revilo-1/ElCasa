import Link from "next/link";

export default function NyIndtaegtPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/budget/indtaegter"
        className="mb-4 inline-flex items-center rounded-md border border-stone/60 px-3 py-2 text-sm text-ink/60 transition-colors hover:bg-stone/30 hover:text-ink"
      >
        ← Tilbage til indtægter
      </Link>

      <h2 className="dimension-line mb-7 inline-block pb-2 font-display text-3xl font-semibold text-ink">
        Tilføj indtægt
      </h2>

      <form className="space-y-4 rounded-2xl border border-stone/70 bg-white/70 p-4 sm:p-5">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/55">
            Navn på indtægt
          </label>
          <input
            type="text"
            placeholder="Fx salg af køkkenmoduler"
            className="w-full rounded-lg border border-stone-dark/40 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/35"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/55">
              Beløb (kr.)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className="w-full rounded-lg border border-stone-dark/40 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/35"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/55">
              Dato
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-stone-dark/40 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/35"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/55">
            Note (valgfri)
          </label>
          <textarea
            rows={4}
            placeholder="Kort beskrivelse af hvor indtægten kommer fra"
            className="w-full rounded-lg border border-stone-dark/40 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/35"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            className="rounded-lg border border-stone-dark/40 px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-stone/40"
          >
            Annuller
          </button>
          <button
            type="button"
            className="rounded-lg bg-terracotta px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
          >
            Gem indtægt
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-ink/45">
        Denne side er første version af opret-indtægt-flowet. Gem-funktionen
        kobles på datalaget i næste iteration.
      </p>
    </div>
  );
}
