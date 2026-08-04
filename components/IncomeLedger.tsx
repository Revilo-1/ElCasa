import { Income } from "@/lib/types";

export default function IncomeLedger({ incomes }: { incomes: Income[] }) {
  if (incomes.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-dark/40 px-4 py-8 text-center text-sm text-ink/50">
        Ingen indtægter/refusioner registreret endnu.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone/70">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone/70 bg-stone/20 text-xs uppercase tracking-wide text-ink/50">
            <th className="px-4 py-2.5 font-medium">Post</th>
            <th className="px-4 py-2.5 font-medium">Beløb</th>
            <th className="px-4 py-2.5 font-medium">Dato</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone/50">
          {incomes.map((income) => (
            <tr key={income.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{income.navn}</p>
                {income.note && (
                  <p className="mt-0.5 text-xs text-ink/50">{income.note}</p>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-sage">
                +{income.beloeb.toLocaleString("da-DK")} kr.
              </td>
              <td className="px-4 py-3 text-ink/70">
                {income.dato
                  ? new Date(income.dato).toLocaleDateString("da-DK")
                  : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
