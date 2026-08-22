"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-muted-foreground">Overview tab content.</p>
      </TabsContent>
      <TabsContent value="metrics">
        <p className="text-sm text-muted-foreground">Metrics tab content.</p>
      </TabsContent>
      <TabsContent value="gallery">
        <p className="text-sm text-muted-foreground">Gallery tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};
