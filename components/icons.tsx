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

export function IconWallet() {
  return (
    <svg {...common}>
      <path d="M3 7a2 2 0 012-2h13a1 1 0 011 1v3M3 7v11a2 2 0 002 2h14a2 2 0 002-2v-8a1 1 0 00-1-1h-5a2 2 0 100 4h5" />
    </svg>
  );
}

export function IconTrendDown() {
  return (
    <svg {...common}>
      <path d="M3 6l7 7 4-4 7 7M15 16h6v-6" />
    </svg>
  );
}

export function IconTrendUp() {
  return (
    <svg {...common}>
      <path d="M3 17l7-7 4 4 7-7M15 7h6v6" />
    </svg>
  );
}

export function IconPiggy() {
  return (
    <svg {...common}>
      <path d="M4 12a5 5 0 015-5h6a5 5 0 015 5v1h2l-1 2h-1v1a2 2 0 01-2 2h-1v2h-2v-2H9v2H7v-2a5 5 0 01-3-4.5V12z" />
      <circle cx="9" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function IconHash() {
  return (
    <svg {...common}>
      <path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16" />
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
