import { ReactNode } from "react";

type Variant = "solid-ink" | "solid-terracotta" | "outline" | "outline-warn";

const variantStyles: Record<Variant, string> = {
  "solid-ink": "bg-ink text-plaster border-transparent",
  "solid-terracotta": "bg-terracotta text-plaster border-transparent",
  outline: "bg-white/40 text-ink border-stone/70",
  "outline-warn": "bg-white/40 text-terracotta-dark border-terracotta/40",
};

export default function StatCard({
  label,
  value,
  sublabel,
  icon,
  variant = "outline",
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  variant?: Variant;
}) {
  const isSolid = variant.startsWith("solid");
  return (
    <div
      className={`flex flex-col justify-between rounded-lg border p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-sm font-medium ${
            isSolid ? "text-plaster/80" : "text-ink/60"
          }`}
        >
          {label}
        </p>
        {icon && (
          <span className={isSolid ? "text-plaster/70" : "text-ink/40"}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-6 font-display text-3xl font-semibold leading-none">
        {value}
      </p>
      {sublabel && (
        <p
          className={`mt-2 text-xs ${
            isSolid ? "text-plaster/70" : "text-ink/50"
          }`}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}
