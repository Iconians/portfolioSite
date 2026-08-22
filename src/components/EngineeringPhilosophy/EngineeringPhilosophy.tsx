import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

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
    <Section id="engineering" className="py-16">
      <Stack gap="sm" className="mb-8">
        <Heading level={2}>Engineering Principles</Heading>
        <Text variant="description">
          I approach software development with a strong focus on architecture,
          performance, and long-term maintainability.
        </Text>
      </Stack>
      <Text className="mb-6 text-foreground">
        A few principles guide how I design and build systems:
      </Text>
      <ul className="list-none space-y-4">
        {principles.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span className="shrink-0 font-medium text-primary">•</span>
            <span>
              <strong className="font-semibold text-foreground">
                {item.title}
              </strong>
              <span className="text-muted-foreground"> {item.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
