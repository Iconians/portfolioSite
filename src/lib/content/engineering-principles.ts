export const ENGINEERING_PRINCIPLES = [
  {
    title: "Server-first architecture",
    description:
      "Favoring SSR and backend-driven logic to reduce unnecessary client complexity.",
  },
  {
    title: "Clear ownership of state",
    description:
      "Separating UI state from business logic and persistence layers.",
  },
  {
    title: "Relational data modeling",
    description:
      "Designing PostgreSQL schemas that reflect real domain relationships rather than quick NoSQL-style patterns.",
  },
  {
    title: "Performance as a feature",
    description:
      "Prioritizing fast load times, efficient queries, and minimal client-side overhead.",
  },
  {
    title: "Pragmatic technology choices",
    description:
      "Selecting tools that solve the problem well rather than chasing trends.",
  },
] as const;

export const ABOUT_VALUE_PRINCIPLES = [
  "Build software around the business, not around the technology.",
  "Prefer maintainable systems over clever implementations.",
  "Design for change, not just today's requirements.",
  "Choose tools because they're appropriate—not because they're trendy.",
] as const;
