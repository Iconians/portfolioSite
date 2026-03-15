export function EngineeringPhilosophy() {
  const principles = [
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
  ];

  return (
    <section id="engineering" className="py-16 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Engineering Approach
      </h2>
      <p className="text-muted-foreground text-lg mb-8">
        I approach software development with a strong focus on architecture,
        performance, and long-term maintainability.
      </p>
      <p className="text-foreground mb-6">
        A few principles guide how I design and build systems:
      </p>
      <ul className="space-y-4 list-none">
        {principles.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-primary font-medium shrink-0">•</span>
            <span>
              <strong className="font-semibold text-foreground">
                {item.title}
              </strong>
              <span className="text-muted-foreground"> {item.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
