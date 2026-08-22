import React from "react";

import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";

import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import "../src/design-system/tokens/tokens.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="bg-background text-foreground p-4 font-sans antialiased">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
