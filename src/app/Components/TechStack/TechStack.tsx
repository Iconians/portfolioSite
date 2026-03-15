"use client";

const TECH_STACK = [
  { name: "Next.js", icon: "nextdotjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Prisma", icon: "prisma" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Stripe", icon: "stripe" },
] as const;

const ICON_BASE = "https://cdn.simpleicons.org";

export function TechStack() {
  return (
    <section id="tech-stack" className="py-12 scroll-mt-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Technologies I Work With
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {TECH_STACK.map(({ name, icon }) => (
          <div
            key={icon}
            className="flex flex-col items-center gap-2 group"
            title={name}
          >
            <div className="p-3 rounded-xl bg-muted/60 border border-border group-hover:border-primary/40 group-hover:bg-muted transition-colors">
              <img
                src={`${ICON_BASE}/${icon}/737373`}
                alt=""
                className="w-8 h-8 md:w-9 md:h-9 object-contain dark:invert dark:brightness-0 dark:opacity-90"
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
