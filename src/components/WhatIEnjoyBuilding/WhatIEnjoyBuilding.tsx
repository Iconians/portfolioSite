import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const focusAreas = [
  {
    title: "Operational Software",
    intro: "Operational software that replaces manual workflows",
    description:
      "Replace manual workflows with software teams actually enjoy using.",
  },
  {
    title: "SaaS Platforms",
    intro: "SaaS platforms designed for long-term growth",
    description:
      "Products designed for long-term growth, maintainability, and real users.",
  },
  {
    title: "Internal Tools",
    intro: "Internal tools and client portals",
    description:
      "Dashboards, client portals, and business applications that simplify daily operations.",
  },
  {
    title: "Backend Systems",
    intro: "Backend systems that prioritize maintainability over shortcuts",
    description:
      "APIs, databases, authentication, and architecture built for reliability and long-term maintenance.",
  },
] as const;

export function WhatIEnjoyBuilding() {
  return (
    <section id="what-i-build" className="py-16 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        What I enjoy building
      </h2>
      <p className="text-muted-foreground text-lg mb-6 text-pretty">
        I enjoy working on software that people rely on every day—not demo
        projects or one-off experiments. Most of my work falls into four areas:
      </p>
      <ul className="space-y-2 list-none mb-10">
        {focusAreas.map((area) => (
          <li key={area.title} className="flex gap-3 text-muted-foreground">
            <span className="text-primary font-medium shrink-0">•</span>
            <span>{area.intro}</span>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {focusAreas.map((area) => (
          <Card key={area.title} className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">{area.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {area.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
