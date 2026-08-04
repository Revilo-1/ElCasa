import Link from "next/link";
import {
  getBudgetPosts,
  getProjects,
  getTasks,
  getTotalBudget,
  summarizeBudgetOverview,
  summarizeTasksOverview,
} from "@/lib/data";
import StatCard from "@/components/StatCard";
import BudgetComparisonChart, {
  AreaBudgetRow,
} from "@/components/BudgetComparisonChart";
import TaskOverviewWidget from "@/components/TaskOverviewWidget";
import {
  IconWallet,
  IconTrendDown,
  IconPiggy,
  IconTrendUp,
  IconHash,
} from "@/components/icons";

function kr(n: number) {
  return `${n.toLocaleString("da-DK")} kr.`;
}

export default async function BudgetPage() {
  const [projects, allBudget, allTasks, budgetRamme] = await Promise.all([
    getProjects(),
    getBudgetPosts(),
    getTasks(),
    getTotalBudget(),
  ]);

  const overview = summarizeBudgetOverview(allBudget, budgetRamme);
  const taskOverview = summarizeTasksOverview(allTasks);

  const chartRows: AreaBudgetRow[] = projects.map((project) => {
    const posts = allBudget.filter((b) => b.projectSlug === project.slug);
    return {
      project,
      estimeret: posts.reduce(
        (sum, p) => sum + (p.estimatDiy ?? p.estimatHaandvaerker ?? 0),
        0
      ),
      faktisk: posts.reduce((sum, p) => sum + (p.faktiskPris ?? 0), 0),
    };
  });

  const overBudget = overview.tilbage < 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="dimension-line inline-block pb-2 font-display text-3xl font-semibold text-ink">
            Budget Oversigt
          </h2>
          <p className="mt-4 text-sm text-ink/60">
            Overblik over budget og estimerede udgifter
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/budget/udgifter"
            className="rounded-md border border-stone-dark/40 bg-white/50 px-3.5 py-2 text-sm font-medium text-ink hover:border-terracotta/50"
          >
            Udgifter
          </Link>
          <Link
            href="/budget/indtaegter"
            className="rounded-md border border-stone-dark/40 bg-white/50 px-3.5 py-2 text-sm font-medium text-ink hover:border-terracotta/50"
          >
            Indtægter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Budget"
          value={kr(overview.budgetRamme)}
          variant="solid-ink"
          icon={<IconWallet />}
        />
        <StatCard
          label="Estimerede udgifter"
          value={kr(overview.estimeredeUdgifter)}
          sublabel={`${overview.procentBrugt}% af budget`}
          variant="solid-terracotta"
          icon={<IconTrendDown />}
        />
        <StatCard
          label="Tilbage"
          value={kr(overview.tilbage)}
          sublabel={overBudget ? "Over budget" : "Inden for budget"}
          variant={overBudget ? "outline-warn" : "outline"}
          icon={<IconPiggy />}
        />
        <StatCard
          label="Budget brugt"
          value={`${overview.procentBrugt}%`}
          sublabel="Af total budget"
          icon={<IconTrendUp />}
        />
        <StatCard
          label="Antal poster"
          value={`${overview.antalPoster}`}
          sublabel="I systemet"
          icon={<IconHash />}
        />
      </div>

      <section className="mt-10">
        <h3 className="mb-1 font-display text-lg font-semibold text-ink">
          Budget vs. estimerede udgifter
        </h3>
        <p className="mb-4 text-sm text-ink/50">
          Sammenligning pr. delprojekt
        </p>
        <div className="rounded-lg border border-stone/70 bg-white/40 p-5">
          <BudgetComparisonChart rows={chartRows} />
        </div>
      </section>

      <section className="mt-10">
        <h3 className="mb-1 font-display text-lg font-semibold text-ink">
          Kræver opmærksomhed
        </h3>
        <p className="mb-4 text-sm text-ink/50">
          Opgaveoverblik på tværs af alle rum
        </p>
        <TaskOverviewWidget
          akutte={taskOverview.akutte}
          snartDeadline={taskOverview.snartDeadline}
          iGang={taskOverview.iGang}
          prioriteret={taskOverview.prioriteret}
        />
      </section>
    </div>
  );
}
