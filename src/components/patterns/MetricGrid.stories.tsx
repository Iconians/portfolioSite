import { MetricCard } from "@/components/patterns/MetricCard";
import { MetricGrid } from "@/components/patterns/MetricGrid";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/MetricGrid",
  component: MetricGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof MetricGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <MetricGrid>
      <MetricCard label="Uptime" value="99.9%" description="Production SLA" />
      <MetricCard label="Users" value="12k+" />
      <MetricCard label="Latency" value="120ms" description="p95 API response" />
    </MetricGrid>
  ),
};
