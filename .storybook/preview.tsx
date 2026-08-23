import React from "react";

import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";

import { ThemeDecorator } from "./ThemeDecorator";

import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import "../src/design-system/tokens/tokens.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Color theme for design-system preview",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        sm: {
          name: "sm (640)",
          styles: { width: "640px", height: "800px" },
          type: "mobile",
        },
        md: {
          name: "md (768)",
          styles: { width: "768px", height: "900px" },
          type: "tablet",
        },
        lg: {
          name: "lg (1024)",
          styles: { width: "1024px", height: "900px" },
          type: "desktop",
        },
      },
    },
  },
  decorators: [
    (Story, { globals }) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ThemeDecorator theme={globals.theme ?? "dark"}>
          <div className="bg-background text-foreground p-4 font-sans antialiased">
            <Story />
          </div>
        </ThemeDecorator>
      </ThemeProvider>
    ),
  ],
};

export default preview;
