import {
  getBudgetPosts,
  getIncomes,
  getProjects,
  getTotalBudget,
  summarizeBudget,
  summarizeBudgetOverview,
} from "@/lib/data";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import BudgetLedger from "@/components/BudgetLedger";
import IncomeLedger from "@/components/IncomeLedger";
import StatCard from "@/components/StatCard";

export default async function BudgetPage() {
  const [posts, incomes, projects, budgetRamme] = await Promise.all([
    getBudgetPosts(),
    getIncomes(),
    getProjects(),
    getTotalBudget(),
  ]);

  const overview = summarizeBudgetOverview(posts, budgetRamme);
  const totalBudget = summarizeBudget(posts);
  const totalIndtaegter = incomes.reduce((sum, i) => sum + i.beloeb, 0);

  const comparisonRows = projects.map((project) => {
    const projectPosts = posts.filter((p) => p.projectSlug === project.slug);
    const summary = summarizeBudget(projectPosts);
    return {
      project,
      estimeret: summary.estimatLavt,
      faktisk: summary.faktisk,
    };
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-terracotta">
          Grundplan
        </p>
        <h2 className="dimension-line mt-1 inline-block pb-2 font-display text-3xl font-semibold text-ink">
          Budget
        </h2>
        <p className="mt-4 max-w-xl text-sm text-ink/60">
          Samlet økonomi på tværs af alle delprojekter.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Budgetramme"
          value={`${budgetRamme.toLocaleString("da-DK")} kr.`}
          variant="solid-ink"
        />
        <StatCard
          label="Estimerede udgifter"
          value={`${overview.estimeredeUdgifter.toLocaleString("da-DK")} kr.`}
          sublabel={`${overview.procentBrugt}% af rammen`}
          variant={overview.procentBrugt > 90 ? "outline-warn" : "outline"}
        />
        <StatCard
          label="Tilbage i budget"
          value={`${overview.tilbage.toLocaleString("da-DK")} kr.`}
          sublabel={`${overview.antalPoster} budgetposter`}
          variant={overview.tilbage < 0 ? "outline-warn" : "outline"}
        />
        <StatCard
          label="Faktiske udgifter"
          value={`${totalBudget.faktisk.toLocaleString("da-DK")} kr.`}
          sublabel={
            totalIndtaegter > 0
              ? `${totalIndtaegter.toLocaleString("da-DK")} kr. i refusioner`
              : undefined
          }
          variant="outline"
        />
      </div>

      <section className="mb-10">
        <h3 className="mb-4 font-display text-lg font-semibold text-ink">
          Estimeret vs. faktisk pr. område
        </h3>
        <BudgetComparisonChart rows={comparisonRows} />
      </section>

      <section className="mb-10">
        <h3 className="mb-4 font-display text-lg font-semibold text-ink">
          Alle budgetposter
        </h3>
        <BudgetLedger posts={posts} projects={projects} />
      </section>

      {incomes.length > 0 && (
        <section>
          <h3 className="mb-4 font-display text-lg font-semibold text-ink">
            Indtægter og refusioner
          </h3>
          <IncomeLedger incomes={incomes} />
        </section>
      )}
    </div>
  );
}
