import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ENGINEERING_PRINCIPLES } from "@/lib/content/engineering-principles";

export function EngineeringPhilosophy() {
  return (
    <Section id="engineering" className="py-16">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <Stack gap="sm">
          <Heading variant="eyebrow">PRINCIPLES</Heading>
          <Heading level={2}>Engineering principles</Heading>
          <Text variant="description">
            How systems are designed: server-first execution, clear state
            ownership, relational modeling, performance, and pragmatic tooling.
          </Text>
        </Stack>

        <ul className="list-none space-y-4">
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
      </div>
    </Section>
  );
}
