"use client";

import { useState } from "react";

import { GalleryLightbox } from "@/components/patterns/GalleryLightbox";

import type { GalleryImage } from "@/design-system/types/gallery";
import type { Meta, StoryObj } from "@storybook/react";

const images: GalleryImage[] = [
  {
    url: "/passwordManagerApp.png",
    alt: "Password manager dashboard overview",
    caption: "Dashboard with credential list",
  },
  {
    url: "/ghostmammoth.png",
    alt: "Mobile navigation shell",
    caption: "Compact mobile layout",
  },
  {
    url: "/ai_powered.png",
    alt: "AI-assisted workflow screen",
  },
];

const meta = {
  title: "Patterns/GalleryLightbox (controlled)",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Controlled lightbox shell for gallery navigation, zoom modes, and dialog focus trap. Prefer `EngineeringGallery` for the full thumbnail + lightbox pattern.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledLightboxDemo({
  startIndex = 0,
}: {
  startIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(startIndex);

  return (
    <div className="p-4">
      <p className="mb-4 text-sm text-muted-foreground">
        Lightbox opens by default for keyboard and zoom testing.
      </p>
      <GalleryLightbox
        images={images}
        openIndex={openIndex}
        onOpenIndexChange={setOpenIndex}
      />
      {openIndex === null ? (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => setOpenIndex(0)}
        >
          Reopen lightbox
        </button>
      ) : null}
    </div>
  );
}

export const OpenByDefault: Story = {
  render: () => <ControlledLightboxDemo startIndex={0} />,
  parameters: {
    docs: {
      description: {
        story:
          "Verify Escape, arrow keys, prev/next controls, and Fit/Actual size toggle while dialog is open.",
      },
    },
  },
};

export const MobileHeaderAndFit: Story = {
  render: () => <ControlledLightboxDemo startIndex={0} />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Mobile: Actual size toggle sits left of close; fit mode does not scroll; actual size scrolls only when intrinsic pixels exceed the viewport.",
      },
    },
  },
};
