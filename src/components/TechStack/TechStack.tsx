"use client";

import { Section } from "@/components/layout/Section";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

const TECH_STACK = [
  { name: "Next.js", icon: "nextdotjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Prisma", icon: "prisma" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Stripe", icon: "stripe" },
] as const;

const ICON_BASE = "https://cdn.simpleicons.org";

export function TechStack() {
  return (
    <Section id="tech-stack" className="py-12">
      <Heading level={2} className="mb-8 text-center text-2xl md:text-3xl">
        Technologies I Work With
      </Heading>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {TECH_STACK.map(({ name, icon }) => (
          <div
            key={icon}
            className="group flex flex-col items-center gap-2"
            title={name}
          >
            <Surface
              variant="inner"
              className="p-3 transition-colors group-hover:border-primary/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external CDN tech icons */}
              <img
                src={`${ICON_BASE}/${icon}/737373`}
                alt=""
                className="h-8 w-8 object-contain md:h-9 md:w-9 dark:invert dark:brightness-0 dark:opacity-90"
              />
            </Surface>
            <Text variant="muted" className="text-sm font-medium group-hover:text-foreground">
              {name}
            </Text>
          </div>
        ))}
      </div>
    </Section>
  );
}
