import { ProjectCard } from "@/components/patterns/ProjectCard";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Patterns/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: "/mountainpic.jpg",
    imageAlt: "Project screenshot",
    title: "Engineering platform",
    description: "Full-stack SaaS with admin tooling and public case studies.",
    badges: ["Next.js", "TypeScript", "PostgreSQL"],
    footer: (
      <span className="text-sm text-muted-foreground">View project</span>
    ),
  },
};
