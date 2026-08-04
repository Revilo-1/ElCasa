// Enkle streg-ikoner i "arkitekttegning"-stil - ét pr. indsatsområde.
// Bevidst holdt til tynde linjer (stroke), ingen udfyldning, for at
// matche grundplan-æstetikken i resten af UI'en.

const common = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconKoekken() {
  return (
    <svg {...common}>
      <path d="M4 8h16M4 8l1 12h14l1-12M9 8V5a3 3 0 016 0v3" />
    </svg>
  );
}

export function IconBad() {
  return (
    <svg {...common}>
      <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 012-2 2 2 0 012 2M4 19v2M18 19v2" />
    </svg>
  );
}

export function IconKaelder() {
  return (
    <svg {...common}>
      <path d="M3 10l9-6 9 6M5 10v10h14V10M9 20v-6h6v6" strokeDasharray="2 2" />
    </svg>
  );
}

export function IconHave() {
  return (
    <svg {...common}>
      <path d="M12 22v-8M12 14a5 5 0 005-5c-3 0-5 1-5 5zM12 14a5 5 0 01-5-5c3 0 5 1 5 5zM7 22h10" />
    </svg>
  );
}

export function IconTag() {
  return (
    <svg {...common}>
      <path d="M3 11l9-7 9 7M5 10v10h14V10" />
    </svg>
  );
}

export function IconEnergi() {
  return (
    <svg {...common}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconPlan() {
  return (
    <svg {...common}>
      <path d="M3 3h18v18H3V3zM3 9h18M9 9v12" strokeDasharray="2 2" />
    </svg>
  );
}

export const iconMap = {
  koekken: IconKoekken,
  bad: IconBad,
  kaelder: IconKaelder,
  have: IconHave,
  tag: IconTag,
  energi: IconEnergi,
  plan: IconPlan,
};
