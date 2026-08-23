import { Label } from "@/components/ui/label";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form field label (Radix). Distinct from typography `Label` used for metric eyebrows.",
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Email",
  },
};
