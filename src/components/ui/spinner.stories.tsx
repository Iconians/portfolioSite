import { Spinner } from "@/components/ui/spinner";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Icon spinner with `role=\"status\"` and `aria-label=\"Loading\"`.",
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
