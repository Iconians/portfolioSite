import type { Meta, StoryObj } from "@storybook/react";

const swatches = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
] as const;

const colorSwatchGrid = () => (
  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
    {swatches.map((swatch) => (
      <div key={swatch.name} className="space-y-1">
        <div
          className={`h-12 w-full rounded-md border border-border ${swatch.className}`}
        />
        <p className="text-xs text-muted-foreground">{swatch.name}</p>
      </div>
    ))}
  </div>
);

const meta = {
  title: "Design System/Tokens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic Tailwind tokens from `tokens.css` + shadcn theme. Legacy aliases (`--heading-color`, etc.) remain in globals for bridge compatibility.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorSwatches: Story = {
  render: colorSwatchGrid,
};

export const LightTheme: Story = {
  parameters: {
    globals: { theme: "light" },
  },
  render: colorSwatchGrid,
};

export const DarkTheme: Story = {
  parameters: {
    globals: { theme: "dark" },
  },
  render: colorSwatchGrid,
};
