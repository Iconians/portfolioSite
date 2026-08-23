import { EngineeringGallery } from "@/components/patterns/EngineeringGallery";

import type { GalleryImage } from "@/design-system/types/gallery";
import type { Meta, StoryObj } from "@storybook/react";

const landscapeShot: GalleryImage = {
  url: "/passwordManagerApp.png",
  alt: "Password manager dashboard overview",
  caption: "Dashboard with credential list and security summary",
};

const portraitShot: GalleryImage = {
  url: "/ghostmammoth.png",
  alt: "Mobile navigation shell",
  caption: "Compact mobile layout with stacked navigation",
};

const wideShot: GalleryImage = {
  url: "/ai_powered.png",
  alt: "AI-assisted workflow screen",
  caption: "Assistant panel beside primary workspace",
};

const adminShot: GalleryImage = {
  url: "/Admin-Rusty-Wedge-Golf-Scramble-07-29-2026_02_23_PM.png",
  alt: "Admin scheduling interface",
};

const launchShot: GalleryImage = {
  url: "/DevLaunch-Systems-06-26-2026_12_57_PM.png",
  alt: "Launch systems marketing hero",
  caption: "Landing hero with product positioning",
};

const sampleImages: GalleryImage[] = [
  landscapeShot,
  portraitShot,
  wideShot,
  adminShot,
  launchShot,
];

const meta = {
  title: "Patterns/EngineeringGallery",
  component: EngineeringGallery,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EngineeringGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {
  args: {
    images: [landscapeShot],
  },
};

export const TwoImages: Story = {
  args: {
    images: [landscapeShot, portraitShot],
  },
};

export const ManyImages: Story = {
  args: {
    images: sampleImages,
  },
};

export const WithCaptions: Story = {
  args: {
    images: [landscapeShot, wideShot, launchShot],
  },
};

export const WithoutCaptions: Story = {
  args: {
    images: [adminShot, portraitShot],
  },
};

export const MixedAspectRatios: Story = {
  args: {
    images: [landscapeShot, portraitShot, wideShot],
  },
};

export const MobileViewport: Story = {
  args: {
    images: sampleImages.slice(0, 3),
  },
  parameters: {
    viewport: {
      defaultViewport: "sm",
    },
  },
};

export const DesktopViewport: Story = {
  args: {
    images: sampleImages,
  },
  parameters: {
    viewport: {
      defaultViewport: "lg",
    },
  },
};

const interactionChecklist =
  "Manual interaction checklist (no @storybook/test installed):\n" +
  "1. Click a thumbnail — lightbox opens, focus moves inside dialog.\n" +
  "2. Next / Previous buttons change image; counter updates (aria-live).\n" +
  "3. ArrowLeft / ArrowRight keyboard navigation when open.\n" +
  "4. Escape closes lightbox and restores page focus.\n" +
  "5. Fit / 100% toggle changes zoom mode without closing.\n" +
  "6. Dialog close control dismisses lightbox.";

export const LightboxInteraction: Story = {
  name: "Lightbox interaction (manual)",
  args: {
    images: sampleImages.slice(0, 4),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: interactionChecklist,
      },
    },
  },
};
