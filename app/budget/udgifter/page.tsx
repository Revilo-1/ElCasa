import Link from "next/link";
import { getBudgetPosts, getProjects } from "@/lib/data";
import BudgetLedger from "@/components/BudgetLedger";

export default async function UdgifterPage() {
  const [posts, projects] = await Promise.all([
    getBudgetPosts(),
    getProjects(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/budget"
        className="mb-4 inline-block text-sm text-ink/50 hover:text-terracotta"
      >
        ← Budget Oversigt
      </Link>
      <h2 className="dimension-line mb-8 inline-block pb-2 font-display text-3xl font-semibold text-ink">
        Udgifter
      </h2>
      <BudgetLedger posts={posts} projects={projects} />
    </div>
  );
}
