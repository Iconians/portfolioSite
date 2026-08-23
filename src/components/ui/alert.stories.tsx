import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "warning"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Inline alert banner with `role=\"alert\"`. Warning variant matches project preview banners.",
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        This deployment is running in preview mode.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Preview</AlertTitle>
      <AlertDescription>
        Visitors see unpublished content. Publish to remove this banner.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Try again.</AlertDescription>
    </Alert>
  ),
};
