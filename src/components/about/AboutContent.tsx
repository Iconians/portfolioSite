import Image from "next/image";

import { Section } from "@/components/layout/Section";
import { Inline, Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { CONTACT_HREF } from "@/components/Nav/navigationLinks";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import {
  ABOUT_VALUE_PRINCIPLES,
  ENGINEERING_PRINCIPLES,
} from "@/lib/content/engineering-principles";
import { FOCUS_AREAS } from "@/lib/content/focus-areas";

import { AboutSkillsGroup } from "./AboutSkillsGroup";

export function AboutProfileSection() {
  return (
    <Section className="py-16">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(280px,360px)_1fr] md:gap-12">
        <div className="mx-auto w-full max-w-sm md:max-w-none">
          <Image
            src="/profilepic.jpg"
            alt="Clayton Cripe"
            width={500}
            height={400}
            className="w-full rounded-2xl object-cover shadow-lg transition-transform duration-300 hover:-translate-y-1"
            priority
          />
        </div>

        <Stack gap="md">
          <Stack gap="sm">
            <Heading variant="eyebrow">ABOUT</Heading>
            <Heading level={1}>Clayton Cripe</Heading>
            <Text className="text-lg font-medium text-primary">
              Senior Full-Stack Engineer
            </Text>
            <Text variant="description" className="text-pretty leading-relaxed">
              I design and deliver operational software, SaaS platforms, and
              internal systems—with architecture, workflows, and long-term
              evolution in mind.
            </Text>
            <Text variant="muted" className="leading-relaxed">
              I work with Next.js, TypeScript, PostgreSQL, and modern cloud
              infrastructure, with equal focus on business workflows and how
              software fits into day-to-day operations.
            </Text>
          </Stack>

          <Inline gap="md" className="flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/Iconians"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:no-underline"
              >
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={CONTACT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:no-underline"
              >
                LinkedIn
              </a>
            </Button>
            <Button size="sm" asChild>
              <a
                href={CONTACT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:no-underline"
              >
                Get in touch
              </a>
            </Button>
          </Inline>
        </Stack>
      </div>
    </Section>
  );
}

export function AboutFocusSection() {
  return (
    <Section id="what-i-build" className="py-16">
      <Stack gap="sm" className="mb-10">
        <Heading variant="eyebrow">FOCUS</Heading>
        <Heading level={2}>What I build</Heading>
        <Text variant="description">
          Four capability areas where most of my work concentrates.
        </Text>
      </Stack>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {FOCUS_AREAS.map((area) => (
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

export function AboutPrinciplesSection() {
  return (
    <Section id="principles" className="py-16">
      <Stack gap="sm" className="mb-8">
        <Heading variant="eyebrow">PRINCIPLES</Heading>
        <Heading level={2}>Engineering principles</Heading>
        <Text variant="description">
          How I approach architecture, performance, and long-term maintainability.
        </Text>
      </Stack>
      <ul className="mb-8 list-none space-y-4">
        {ENGINEERING_PRINCIPLES.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span className="shrink-0 font-medium text-muted-foreground">•</span>
            <span>
              <strong className="font-semibold text-foreground">
                {item.title}
              </strong>
              <span className="text-muted-foreground"> {item.description}</span>
            </span>
          </li>
        ))}
      </ul>
      <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
        {ABOUT_VALUE_PRINCIPLES.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutSkillsSection({
  skills,
  engineeringSkills,
}: {
  skills: string[];
  engineeringSkills: string[];
}) {
  return (
    <Section id="skills" className="py-16">
      <Stack gap="lg">
        <AboutSkillsGroup title="Core technologies" items={skills} listKey="core" />
        <AboutSkillsGroup
          title="Engineering"
          items={engineeringSkills}
          listKey="engineering"
        />
      </Stack>
    </Section>
  );
}

export function AboutNarrativeSection() {
  return (
    <Section className="py-16">
      <Stack gap="md">
        <Text className="leading-relaxed text-muted-foreground">
          Outside of client work, I mentor developers, write technical articles,
          and continue studying software engineering fundamentals—focused on why
          certain designs remain maintainable as systems grow.
        </Text>
        <Text variant="muted" className="text-sm">
          <span className="font-medium text-foreground">Current focus: </span>
          operational SaaS, internal tools, and systems designed to evolve with
          the business.
        </Text>
      </Stack>
    </Section>
  );
}

export function AboutCtaSection() {
  return (
    <Section className="py-16">
      <Surface variant="card" padding="default" className="text-center">
        <Stack gap="md" className="items-center">
          <Heading level={2} className="text-2xl">Let&apos;s build together</Heading>
          <Text variant="description" className="max-w-xl text-pretty">
            If you&apos;re looking for someone who thinks through the full
            system—from architecture to deployment—I&apos;d be glad to connect.
          </Text>
          <Button asChild>
            <a
              href={CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:no-underline"
            >
              Get in touch
            </a>
          </Button>
        </Stack>
      </Surface>
    </Section>
  );
}
