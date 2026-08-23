import type { Meta, StoryObj } from "@storybook/react";

const neutralSwatches = [
  { name: "background (canvas)", className: "bg-background" },
  { name: "surface-alt", className: "bg-surface-alt" },
  { name: "footer", className: "bg-footer" },
  { name: "card (surface)", className: "bg-card" },
  { name: "secondary (elevated)", className: "bg-secondary" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "border", className: "bg-border" },
] as const;

const accentSwatches = [
  { name: "primary / ds-accent", className: "bg-primary" },
  { name: "ds-accent-muted", className: "bg-ds-accent-muted" },
  { name: "ds-accent-muted-fg", className: "bg-ds-accent-muted-foreground" },
  { name: "ring", className: "bg-ring" },
] as const;

const swatchGrid = (items: readonly { name: string; className: string }[]) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {items.map((swatch) => (
      <div key={swatch.name} className="space-y-1">
        <div
          className={`h-12 w-full rounded-md border border-border ${swatch.className}`}
        />
        <p className="text-xs text-muted-foreground">{swatch.name}</p>
      </div>
    ))}
  </div>
);

const accentUsageDemo = () => (
  <div className="space-y-4 rounded-xl border border-border bg-background p-4">
    <p className="text-xs font-medium uppercase tracking-wider text-ds-accent">
      ENGINEERING PRINCIPLES
    </p>
    <p className="text-lg font-semibold text-foreground">Section heading</p>
    <p className="text-sm text-muted-foreground">Muted supporting body text.</p>
    <a href="#" className="text-sm text-primary underline">Engineering article link</a>
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-ds-accent-hover"
      >
        Get in touch
      </button>
      <button
        type="button"
        className="rounded-md border border-border px-3 py-2 text-sm text-foreground"
      >
        View work
      </button>
      <span
        className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-foreground"
      >
        TypeScript
      </span>
    </div>
    <p className="rounded-md border border-ring px-3 py-2 font-mono text-sm text-primary">
      $ deploy --env production
    </p>
    <button
      type="button"
      className="rounded-md border border-border px-3 py-2 text-sm text-foreground outline outline-2 outline-offset-2 outline-ring"
    >
      Focus ring example
    </button>
  </div>
);

const meta = {
  title: "Design System/Tokens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Candidate C — Refined Green semantic tokens (`tokens.css`) mapped to shadcn/Tailwind. Neutrals on canvas/surfaces; green accent for interactive emphasis only.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralSurfaces: Story = {
  render: () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Neutral surfaces</h3>
      {swatchGrid(neutralSwatches)}
    </div>
  ),
};

export const AccentTokens: Story = {
  render: () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Accent tokens</h3>
      {swatchGrid(accentSwatches)}
    </div>
  ),
};

export const AccentUsage: Story = {
  render: accentUsageDemo,
};

export const LightTheme: Story = {
  parameters: { globals: { theme: "light" } },
  render: () => (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold">Light theme</h3>
      {swatchGrid(neutralSwatches)}
      {swatchGrid(accentSwatches)}
      {accentUsageDemo()}
    </div>
  ),
};

export const DarkTheme: Story = {
  parameters: { globals: { theme: "dark" } },
  render: () => (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold">Dark theme</h3>
      {swatchGrid(neutralSwatches)}
      {swatchGrid(accentSwatches)}
      {accentUsageDemo()}
    </div>
  ),
};

export const AlternateSectionBand: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-0">
      <div className="bg-background p-4 text-foreground">Canvas band</div>
      <div className="bg-surface-alt p-4 text-foreground">Surface-alt band</div>
      <div className="bg-footer p-4 text-foreground">Footer tone band</div>
    </div>
  ),
};
