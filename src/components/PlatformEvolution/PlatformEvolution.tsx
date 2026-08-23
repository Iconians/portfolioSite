import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

const EVOLUTION_ARCS = [
  {
    title: "DevLaunch CRM",
    slug: "devlaunch-crm",
    stages: [
      "Business administration — leads, clients, projects, invoices (foundation CRM).",
      "Operations expansion — Stripe, financial tracking, client access flows.",
      "Project management integration — shared delivery data with task/kanban workflows.",
      "Security & authorization architecture — middleware, RBAC, CI guardrails.",
      "Reporting & operational intelligence — automated weekly reports, PDF output.",
    ],
    lesson:
      "Operational software accretes workflows; architecture must absorb new domains without splitting into disconnected apps.",
  },
  {
    title: "Engineering Portfolio Management System",
    slug: "engineering-portfolio-management-system",
    stages: [
      "Static portfolio — manual project pages.",
      "React modernization — component structure, articles.",
      "Next.js + Prisma + admin — SSR, dynamic content, PostgreSQL.",
      "Media infrastructure — R2, media library, hero images.",
      "Engineering case-study system — metrics, evolution, platform showcase, public IA.",
    ],
    lesson:
      "The portfolio itself became an engineered content system—not a marketing site refactor.",
  },
  {
    title: "Ghost Mammoth Pickleball",
    slug: "ghost-mammoth-pickle-ball",
    stages: [
      "MVP — membership + Supabase + Stripe foundations.",
      "Queue/court system — domain-specific assignment logic beyond CRUD.",
      "Production hardening — auth, email, notifications, accessibility.",
      "Architecture refactor — server/client boundaries, shared queue modules.",
      "Advanced rotation + membership-connected events — configurable domain rules.",
    ],
    lesson:
      "Realtime operational domains require explicit domain modeling, not generic admin patterns.",
  },
] as const;

export function PlatformEvolution() {
  return (
    <Section id="evolution" className="py-16">
      <Stack gap="sm" className="mb-12">
        <Heading variant="eyebrow">EVOLUTION</Heading>
        <Heading level={2}>How systems evolve</Heading>
        <Text variant="description">
          Three concise arcs showing intentional architecture change over time—not
          one-off refactors, but systems designed to absorb new domains.
        </Text>
      </Stack>

      <div className="grid gap-6 lg:grid-cols-3">
        {EVOLUTION_ARCS.map((arc) => (
          <Surface key={arc.slug} variant="card" padding="default" className="h-full">
            <Stack gap="md">
              <Heading level={3} className="text-lg">{arc.title}</Heading>
              <ol className="list-none space-y-2">
                {arc.stages.map((stage, index) => (
                  <li key={stage} className="flex gap-2 text-sm">
                    <span className="shrink-0 font-medium text-muted-foreground tabular-nums">
                      {index + 1}.
                    </span>
                    <span className="text-muted-foreground">{stage}</span>
                  </li>
                ))}
              </ol>
              <Text variant="muted" className="text-sm leading-relaxed border-t border-border pt-4">
                <span className="font-medium text-foreground">Lesson: </span>
                {arc.lesson}
              </Text>
            </Stack>
          </Surface>
        ))}
      </div>
    </Section>
  );
}
