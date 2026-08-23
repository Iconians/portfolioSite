import { GalleryLightboxImageViewport } from "@/components/patterns/GalleryLightboxImageViewport";

import type { GalleryImage } from "@/design-system/types/gallery";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

const dashboardShot: GalleryImage = {
  url: "/passwordManagerApp.png",
  alt: "Password manager dashboard overview",
  caption: "Dashboard with credential list and security summary",
};

const landscapeShot: GalleryImage = {
  url: "/ai_powered.png",
  alt: "AI-assisted workflow screen",
  caption: "Wide landscape dashboard",
};

const portraitShot: GalleryImage = {
  url: "/ghostmammoth.png",
  alt: "Mobile navigation shell",
  caption: "Portrait-oriented mobile layout",
};

const lowResShot: GalleryImage = {
  url: "/vercel.svg",
  alt: "Small vector logo",
  caption: "Low intrinsic dimensions — actual size may appear smaller than fit",
};

const dialogShellDecorator = (Story: () => ReactElement) => (
  <div className="flex h-auto max-h-[min(90dvh,90vh)] w-[min(95vw,100vw)] flex-col gap-2 border border-border bg-background py-2 pl-2 pr-12">
    <Story />
  </div>
);

const mobileShellDecorator = (Story: () => ReactElement) => (
  <div className="mx-auto flex h-auto max-h-[min(90dvh,90vh)] w-[390px] flex-col gap-2 border border-border bg-background p-2">
    <Story />
  </div>
);

const meta = {
  title: "Patterns/GalleryLightboxImageViewport",
  component: GalleryLightboxImageViewport,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [dialogShellDecorator],
} satisfies Meta<typeof GalleryLightboxImageViewport>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FitToWindow: Story = {
  args: {
    image: dashboardShot,
    viewMode: "fit",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fit: entire image visible, centered, object-contain, no scrolling in the viewport.",
      },
    },
  },
};

export const MobileFitLandscape: Story = {
  args: {
    image: landscapeShot,
    viewMode: "fit",
  },
  decorators: [mobileShellDecorator],
  parameters: {
    docs: {
      description: {
        story:
          "390px shell — landscape fit fills modal width; viewport height follows image aspect ratio.",
      },
    },
  },
};

export const MobileFitPortrait: Story = {
  args: {
    image: portraitShot,
    viewMode: "fit",
  },
  decorators: [mobileShellDecorator],
  parameters: {
    docs: {
      description: {
        story: "Portrait fit — height-capped, centered, no overflow scroll.",
      },
    },
  },
};

export const ActualSizeHighResolution: Story = {
  args: {
    image: dashboardShot,
    viewMode: "actual",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Actual size at intrinsic pixels — scroll when dimensions exceed the viewport.",
      },
    },
  },
};

export const ActualSizeLowResolution: Story = {
  args: {
    image: lowResShot,
    viewMode: "actual",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Small intrinsic dimensions — actual size may be smaller than fit; that is expected.",
      },
    },
  },
};

export const ActualSizeWideScreenshot: Story = {
  args: {
    image: landscapeShot,
    viewMode: "actual",
  },
  parameters: {
    docs: {
      description: {
        story: "Wide intrinsic layout — horizontal scroll for detail inspection.",
      },
    },
  },
};
