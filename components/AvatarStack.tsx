import Image from "next/image";
import { Person } from "@/lib/types";

// size: "sm" = 20px (filter-knapper), "md" = 24px (avatar stack / widget)
function Avatar({
  person,
  size = "md",
  overlap = false,
}: {
  person: Person;
  size?: "sm" | "md";
  overlap?: boolean;
}) {
  const dim = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const px = size === "sm" ? 20 : 24;
  const overlapCls = overlap ? "-ml-1.5 first:ml-0" : "";
  const base = `shrink-0 flex items-center justify-center rounded-full border-2 border-white overflow-hidden ${dim} ${overlapCls}`;

  if (person.foto) {
    return (
      <div title={person.navn} className={`${base} bg-stone/30`}>
        <Image
          src={person.foto}
          alt={person.navn}
          width={px}
          height={px}
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <span
      title={person.navn}
      className={`${base} bg-pine/20 font-mono text-[10px] font-medium text-ink/70`}
    >
      {person.initialer}
    </span>
  );
}

export { Avatar };

export default function AvatarStack({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return <span className="text-xs text-ink/45">Ingen ansvarlige</span>;
  }

  return (
    <div className="flex items-center">
      {people.slice(0, 2).map((person) => (
        <Avatar key={person.id} person={person} size="md" overlap />
      ))}
    </div>
  );
}
