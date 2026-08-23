import { Timeline } from "@/components/patterns/Timeline";
import { TimelineItem } from "@/components/patterns/TimelineItem";
import { Text } from "@/components/typography/Text";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/Timeline",
  component: Timeline,
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Timeline>
      <TimelineItem eyebrow="2024" meta="v1.0" title="Initial release">
        <Text>Shipped core platform capabilities.</Text>
      </TimelineItem>
      <TimelineItem
        eyebrow="2025"
        meta="v2.0"
        title="Scale milestone"
        isLast
      >
        <Text>Expanded infrastructure and observability.</Text>
      </TimelineItem>
    </Timeline>
  ),
};
