import { Person } from "@/lib/types";

export default function AvatarStack({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return <span className="text-xs text-ink/45">Ingen ansvarlige</span>;
  }

  return (
    <div className="flex items-center">
      {people.slice(0, 2).map((person, index) => (
        <span
          key={person.id}
          title={person.navn}
          className="-ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-pine/20 font-mono text-[10px] font-medium text-ink/70 first:ml-0"
          style={{ zIndex: people.length - index }}
        >
          {person.initialer}
        </span>
      ))}
    </div>
  );
}
