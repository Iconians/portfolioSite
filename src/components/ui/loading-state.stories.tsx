import { LoadingState } from "@/components/ui/loading-state";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Spinner + label with `role=\"status\"` for loading regions.",
      },
    },
  },
} satisfies Meta<typeof LoadingState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Loading projects…",
  },
};
