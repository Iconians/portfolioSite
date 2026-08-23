import { EmptyState } from "@/components/patterns/EmptyState";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items yet",
    description: "Create your first entry to get started.",
  },
};
