import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

const focusAreas = [
  {
    title: "Operational Software",
    intro: "Operational software that replaces manual workflows",
    description:
      "Replace manual workflows with software teams actually enjoy using.",
  },
  {
    title: "SaaS Platforms",
    intro: "SaaS platforms designed for long-term growth",
    description:
      "Products designed for long-term growth, maintainability, and real users.",
  },
  {
    title: "Internal Tools",
    intro: "Internal tools and client portals",
    description:
      "Dashboards, client portals, and business applications that simplify daily operations.",
  },
  {
    title: "Backend Systems",
    intro: "Backend systems that prioritize maintainability over shortcuts",
    description:
      "APIs, databases, authentication, and architecture built for reliability and long-term maintenance.",
  },
] as const;

export function WhatIEnjoyBuilding() {
  return (
    <Section id="what-i-build" className="py-16">
      <Stack gap="sm" className="mb-6">
        <Heading level={2}>What I enjoy building</Heading>
        <Text variant="description" className="text-pretty">
          I enjoy working on software that people rely on every day—not demo
          projects or one-off experiments. Most of my work falls into four areas:
        </Text>
      </Stack>

      <ul className="mb-10 list-none space-y-2">
        {focusAreas.map((area) => (
          <li key={area.title} className="flex gap-3 text-muted-foreground">
            <span className="shrink-0 font-medium text-primary">•</span>
            <span>{area.intro}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {focusAreas.map((area) => (
          <Surface key={area.title} variant="card" padding="default" className="h-full">
            <Stack gap="sm">
              <Heading level={3} className="text-xl">{area.title}</Heading>
              <Text variant="muted" className="text-sm leading-relaxed">
                {area.description}
              </Text>
            </Stack>
          </Surface>
        ))}
      </div>
    </Section>
  );
}
