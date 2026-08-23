import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { FOCUS_AREAS } from "@/lib/content/focus-areas";

export function WhatIEnjoyBuilding() {
  return (
    <Section id="what-i-build" className="py-16">
      <Stack gap="sm" className="mb-10">
        <Heading variant="eyebrow">FOCUS</Heading>
        <Heading level={2}>What I build</Heading>
        <Text variant="description" className="text-pretty">
          Four capability areas where most of my work concentrates—software
          people rely on every day, not demo projects or one-off experiments.
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
