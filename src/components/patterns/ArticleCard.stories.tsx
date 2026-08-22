import { ArticleCard } from "@/components/patterns/ArticleCard";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ArticleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Building resilient APIs",
    description: "Patterns for portfolio-scale services without enterprise overhead.",
    date: "2025-01-15",
  },
};
