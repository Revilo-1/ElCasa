import { BudgetPost } from "@/lib/types";

export default function BudgetTable({ posts }: { posts: BudgetPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-dark/40 px-4 py-8 text-center text-sm text-ink/50">
        Ingen budgetposter endnu i dette område.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone/70">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone/70 bg-stone/20 text-xs uppercase tracking-wide text-ink/50">
            <th className="px-4 py-2.5 font-medium">Post</th>
            <th className="px-4 py-2.5 font-medium">DIY-estimat</th>
            <th className="px-4 py-2.5 font-medium">Håndværker-estimat</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone/50">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{post.navn}</p>
                {post.note && (
                  <p className="mt-0.5 text-xs text-ink/50">{post.note}</p>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-ink/80">
                {post.estimatDiy
                  ? `${post.estimatDiy.toLocaleString("da-DK")} kr.`
                  : "–"}
              </td>
              <td className="px-4 py-3 font-mono text-ink/80">
                {post.estimatHaandvaerker
                  ? `${post.estimatHaandvaerker.toLocaleString("da-DK")} kr.`
                  : "–"}
              </td>
              <td className="px-4 py-3 text-ink/70">{post.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
