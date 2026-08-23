import { Caption } from "@/components/typography/Caption";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Typography/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic heading scale, body text variants, metric labels, and captions. Eyebrows use `text-ds-accent`.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const HeadingLevels: Story = {
  name: "Heading levels",
  render: () => (
    <div className="space-y-3 max-w-xl">
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
    </div>
  ),
};

export const Eyebrow: Story = {
  name: "Eyebrow",
  render: () => <Heading variant="eyebrow">Case study</Heading>,
};

export const DisplayHeading: Story = {
  name: "Display (case study hero)",
  render: () => (
    <Heading level={1} variant="display" className="max-w-2xl">
      Engineering Portfolio Management System
    </Heading>
  ),
};

export const TextVariants: Story = {
  name: "Text variants",
  render: () => (
    <div className="space-y-4 max-w-xl">
      <Text>Body text — default paragraph style.</Text>
      <Text variant="bodyLarge">Body large — hero and lead paragraphs.</Text>
      <Text variant="description">Description — section intros.</Text>
      <Text variant="muted">Muted — secondary supporting copy.</Text>
    </div>
  ),
};

export const LabelAndCaption: Story = {
  name: "Label and Caption",
  render: () => (
    <figure className="space-y-2">
      <Label>Metric label</Label>
      <Caption>Figcaption for gallery or supporting media.</Caption>
    </figure>
  ),
};

export const ResponsiveScale: Story = {
  name: "Responsive — md viewport",
  render: () => (
    <Heading level={2} className="max-w-md">
      Section title scales at md breakpoint
    </Heading>
  ),
  decorators: [
    (Story) => (
      <div className="w-[768px] p-4 border border-dashed border-border">
        <Story />
      </div>
    ),
  ],
};
