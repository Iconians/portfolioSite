import { GalleryLightboxImageViewport } from "@/components/patterns/GalleryLightboxImageViewport";

import type { GalleryImage } from "@/design-system/types/gallery";
import type { Meta, StoryObj } from "@storybook/react";

const dashboardShot: GalleryImage = {
  url: "/passwordManagerApp.png",
  alt: "Password manager dashboard overview",
  caption: "Dashboard with credential list and security summary",
};

const meta = {
  title: "Patterns/GalleryLightbox",
  component: GalleryLightboxImageViewport,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-[min(90dvh,90vh)] w-[min(95vw,100vw)] flex-col gap-2 border border-border bg-background p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GalleryLightboxImageViewport>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FitToWindow: Story = {
  args: {
    image: dashboardShot,
    viewMode: "fit",
  },
};

export const ActualSize: Story = {
  args: {
    image: dashboardShot,
    viewMode: "actual",
  },
};

export const ActualSizeWideScreenshot: Story = {
  args: {
    image: {
      url: "/ai_powered.png",
      alt: "AI-assisted workflow screen",
      caption: "Wide dashboard layout for scroll inspection",
    },
    viewMode: "actual",
  },
};
