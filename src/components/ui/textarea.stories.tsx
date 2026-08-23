import { Textarea } from "@/components/ui/textarea";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Write a short summary…",
    rows: 4,
  },
};
