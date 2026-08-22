import { ReviewCard } from "@/components/patterns/ReviewCard";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/ReviewCard",
  component: ReviewCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Excellent collaborator",
    content:
      "Clayton delivered a polished platform and communicated clearly throughout the project.",
    stars: 5,
  },
};
