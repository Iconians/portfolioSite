import { Container } from "@/components/layout/Container";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { Section } from "@/components/layout/Section";
import { Inline, Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

import type { Meta, StoryObj } from "@storybook/react";

const containerDemo = () => (
  <Container className="border border-dashed border-border py-4">
    <p className="text-sm text-muted-foreground">
      Max-width page container with horizontal padding.
    </p>
  </Container>
);

const meta = {
  title: "Layout/Overview",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Layout primitives: page shell (`Container`), section rhythm (`Section`), surfaces, spacing (`Stack`/`Inline`), and content width presets.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContainerDefault: Story = {
  name: "Container",
  render: containerDemo,
};

export const SectionDefault: Story = {
  name: "Section",
  render: () => (
    <Section id="example-section" labelledBy="section-heading" className="border-y border-border">
      <Heading id="section-heading" level={2}>Section title</Heading>
      <Text>Section vertical rhythm with scroll margin for in-page nav.</Text>
    </Section>
  ),
};

export const SurfaceVariants: Story = {
  name: "Surface variants",
  render: () => (
    <Stack gap="md" className="w-full max-w-lg p-4">
      <Surface variant="card" padding="default">Card surface</Surface>
      <Surface variant="elevated">Elevated surface</Surface>
      <Surface variant="inner" padding="default">Inner nested surface</Surface>
      <Surface variant="panel" padding="default">Panel surface</Surface>
    </Stack>
  ),
};

export const StackAndInline: Story = {
  name: "Stack / Inline",
  render: () => (
    <Stack gap="lg" className="w-full max-w-lg p-4">
      <Stack gap="sm">
        <Text variant="muted">Stack gap sm</Text>
        <Surface variant="card" padding="default">Item one</Surface>
        <Surface variant="card" padding="default">Item two</Surface>
      </Stack>
      <Inline gap="md">
        <Surface variant="inner" padding="default">Inline A</Surface>
        <Surface variant="inner" padding="default">Inline B</Surface>
      </Inline>
    </Stack>
  ),
};

export const ContentWidthPresets: Story = {
  name: "ContentWidth",
  render: () => (
    <Stack gap="md" className="w-full p-4">
      <ContentWidth width="narrow" className="border border-dashed border-border p-3">
        <Text variant="muted">narrow (max-w-2xl)</Text>
      </ContentWidth>
      <ContentWidth width="article" className="border border-dashed border-border p-3">
        <Text variant="muted">article (max-w-3xl)</Text>
      </ContentWidth>
      <ContentWidth width="wide" className="border border-dashed border-border p-3">
        <Text variant="muted">wide (full section width)</Text>
      </ContentWidth>
    </Stack>
  ),
};

export const ResponsiveSm: Story = {
  name: "Responsive — sm",
  render: containerDemo,
  decorators: [
    (Story) => (
      <div className="w-[640px] border border-border">
        <Story />
      </div>
    ),
  ],
};

export const ResponsiveMd: Story = {
  name: "Responsive — md",
  render: containerDemo,
  decorators: [
    (Story) => (
      <div className="w-[768px] border border-border">
        <Story />
      </div>
    ),
  ],
};

export const ResponsiveLg: Story = {
  name: "Responsive — lg",
  render: containerDemo,
  decorators: [
    (Story) => (
      <div className="w-[1024px] border border-border">
        <Story />
      </div>
    ),
  ],
};

export const SectionBandTones: Story = {
  name: "SectionBand",
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="bg-background p-4 text-sm text-muted-foreground">Canvas above</div>
      <div className="w-full bg-surface-alt p-4 text-foreground">
        Surface-alt full-bleed band
      </div>
      <div className="w-full bg-footer p-4 text-foreground">
        Footer tone band
      </div>
    </div>
  ),
};
