import Link from "next/link";
import { getIncomes } from "@/lib/data";
import IncomeLedger from "@/components/IncomeLedger";

export default async function IndtaegterPage() {
  const incomes = await getIncomes();

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/budget"
        className="mb-4 inline-block text-sm text-ink/50 hover:text-terracotta"
      >
        ← Budget Oversigt
      </Link>
      <h2 className="dimension-line mb-8 inline-block pb-2 font-display text-3xl font-semibold text-ink">
        Indtægter
      </h2>
      <p className="mb-6 max-w-xl text-sm text-ink/60">
        Penge der kommer ind i projektet - fx forsikringsudbetalinger eller salg
        af gamle hvidevarer/inventar i forbindelse med renoveringen.
      </p>
      <IncomeLedger incomes={incomes} />
    </div>
  );
}
