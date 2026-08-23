"use client";

import { Section } from "@/components/layout/Section";
import { Inline, Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Badge } from "@/components/ui/badge";

const CAPABILITY_GROUPS = [
  {
    title: "Frontend / rendering",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SSR"],
  },
  {
    title: "Backend / APIs",
    items: ["Node.js", "REST APIs"],
  },
  {
    title: "Data / persistence",
    items: ["PostgreSQL", "Prisma", "Neon"],
  },
  {
    title: "Auth / billing",
    items: ["Authentication", "RBAC", "Stripe"],
  },
  {
    title: "Realtime / async",
    items: ["Realtime collaboration", "Background jobs", "Email (Resend)"],
  },
  {
    title: "Infrastructure",
    items: ["Cloud-hosted Postgres", "Object storage (R2)", "CI"],
  },
  {
    title: "Testing / quality",
    items: ["Playwright", "Lint / CI guardrails"],
  },
  {
    title: "AI-assisted engineering",
    items: ["AI-assisted workflows in production tooling"],
  },
] as const;

export function EngineeringStack() {
  return (
    <Section id="engineering-stack" className="py-16">
      <Stack gap="sm" className="mb-10">
        <Heading variant="eyebrow">STACK</Heading>
        <Heading level={2}>Engineering stack</Heading>
        <Text variant="description">
          Grouped capabilities across the stack—from rendering and APIs to data,
          auth, realtime systems, and quality guardrails.
        </Text>
      </Stack>

      <div className="grid gap-6 md:grid-cols-2">
        {CAPABILITY_GROUPS.map((group) => (
          <Stack key={group.title} gap="sm">
            <Heading level={3} className="text-sm font-semibold uppercase tracking-wide">
              {group.title}
            </Heading>
            <Inline gap="sm" className="flex-wrap">
              {group.items.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </Inline>
          </Stack>
        ))}
      </div>
    </Section>
  );
}

/** @deprecated Use `EngineeringStack` — retained for import compatibility. */
export const TechStack = EngineeringStack;
