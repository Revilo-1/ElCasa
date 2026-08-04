import { notFound } from "next/navigation";
import {
  getBudgetPosts,
  getPeople,
  getProject,
  getTasks,
  summarizeBudget,
  summarizeTasks,
} from "@/lib/data";
import { projects } from "@/lib/mock-data";
import { Area } from "@/lib/types";
import TaskList from "@/components/TaskList";
import BudgetTable from "@/components/BudgetTable";
import ProgressBar from "@/components/ProgressBar";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug as Area;
  const project = await getProject(slug);
  if (!project) notFound();

  const [tasks, budgetPosts, people] = await Promise.all([
    getTasks(slug),
    getBudgetPosts(slug),
    getPeople(),
  ]);

  const taskSummary = summarizeTasks(tasks);
  const budgetSummary = summarizeBudget(budgetPosts);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-terracotta">
          Delprojekt
        </p>
        <h2 className="dimension-line mt-1 inline-block pb-2 font-display text-3xl font-semibold text-ink">
          {project.navn}
        </h2>
        <p className="mt-4 max-w-xl text-sm text-ink/60">
          {project.beskrivelse}
        </p>
        <div className="mt-5 max-w-xs space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-ink/50">
            <span>{taskSummary.procent}% afsluttet</span>
            <span>
              {taskSummary.afsluttet}/{taskSummary.total}
            </span>
          </div>
          <ProgressBar percent={taskSummary.procent} />
        </div>
      </div>

      <section className="mb-10">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Opgaver
        </h3>
        <TaskList tasks={tasks} people={people} />
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            Budget
          </h3>
          <p className="font-mono text-xs text-ink/50">
            {budgetSummary.estimatLavt.toLocaleString("da-DK")} –{" "}
            {budgetSummary.estimatHoejt.toLocaleString("da-DK")} kr. estimeret
          </p>
        </div>
        <BudgetTable posts={budgetPosts} />
      </section>
    </div>
  );
}
