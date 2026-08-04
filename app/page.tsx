import {
  getBudgetPosts,
  getProjects,
  getTasks,
  summarizeBudget,
  summarizeTasks,
} from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export default async function DashboardPage() {
  const [projects, allTasks, allBudget] = await Promise.all([
    getProjects(),
    getTasks(),
    getBudgetPosts(),
  ]);

  const totalBudget = summarizeBudget(allBudget);
  const totalTasks = summarizeTasks(allTasks);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-terracotta">
          Projektoverblik
        </p>
        <h2 className="dimension-line mt-1 inline-block pb-2 font-display text-3xl font-semibold text-ink">
          Tværstræde 12
        </h2>
        <p className="mt-4 max-w-xl text-sm text-ink/60">
          {totalTasks.afsluttet} af {totalTasks.total} opgaver afsluttet på
          tværs af huset · estimeret{" "}
          {totalBudget.estimatLavt.toLocaleString("da-DK")}–
          {totalBudget.estimatHoejt.toLocaleString("da-DK")} kr.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const projectTasks = allTasks.filter(
            (t) => t.projectSlug === project.slug
          );
          const projectBudget = allBudget.filter(
            (b) => b.projectSlug === project.slug
          );
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              taskSummary={summarizeTasks(projectTasks)}
              budgetSummary={summarizeBudget(projectBudget)}
            />
          );
        })}
      </div>
    </div>
  );
}
