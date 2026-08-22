import { Link } from "@/components/ui/link";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Styled Next.js link with external affordance. External links expose sr-only “opens in new tab” text.",
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Internal: Story = {
  args: {
    href: "/blogs",
    children: "Read articles",
  },
};

export const External: Story = {
  args: {
    href: "https://github.com",
    external: true,
    children: "GitHub",
  },
};
