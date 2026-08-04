export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone/50">
      <div
        className="h-full rounded-full bg-terracotta transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
