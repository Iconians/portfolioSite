"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const TERMINAL_SEQUENCE = [
  { text: "$ initializing engineering portfolio...", delay: 0 },
  { text: "Loading systems profile...", delay: 800 },
  { text: "✓ Stack: Next.js, TypeScript, PostgreSQL", delay: 1400 },
  {
    text: "✓ Focus: SaaS, operational software, internal systems",
    delay: 2000,
  },
  {
    text: "✓ Approach: server-first, maintainable, business-driven",
    delay: 2600,
  },
  { text: "$ analyzing workflows...", delay: 3200 },
  { text: "> Turning business processes into software.", delay: 3800 },
  { text: "$ ready to engineer what comes next", delay: 4400 },
];

const STATIC_LINES = TERMINAL_SEQUENCE.map((line) => line.text);

function terminalLineClass(line: string): string {
  if (line.startsWith("✓")) {
    return "text-ds-accent";
  }
  if (line.startsWith("$")) {
    return "text-ds-accent";
  }
  if (line.startsWith(">")) {
    return "font-semibold text-ds-accent";
  }
  return "text-foreground";
}

function TerminalLoaderShell({
  lines,
  showCursor,
}: {
  lines: string[];
  showCursor: boolean;
}) {
  return (
    <div className="relative mx-auto aspect-square max-w-md max-[380px]:aspect-auto max-[380px]:min-h-[400px]">
      <div
        className="absolute inset-0 rounded-2xl bg-ds-accent/15 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl max-[380px]:h-auto max-[380px]:min-h-[400px] max-[380px]:overflow-y-auto">
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <div className="flex gap-1.5" aria-hidden>
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            clayton@engineering:~
          </span>
        </div>

        <div className="space-y-2 font-mono text-sm">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${terminalLineClass(line)} animate-in fade-in slide-in-from-left-2 duration-300 motion-reduce:animate-none`}
            >
              {line}
            </div>
          ))}
          {showCursor ? (
            <div
              className="inline-block h-4 w-2 bg-ds-accent motion-reduce:animate-none animate-pulse"
              aria-hidden
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TerminalLoaderAnimated() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    TERMINAL_SEQUENCE.forEach((line) => {
      const timeout = setTimeout(() => {
        setLines((prev) => {
          if (prev.includes(line.text)) {
            return prev;
          }
          return [...prev, line.text];
        });
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const showCursor =
    lines.length > 0 && lines.length < TERMINAL_SEQUENCE.length;

  return <TerminalLoaderShell lines={lines} showCursor={showCursor} />;
}

export function TerminalLoader() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <TerminalLoaderShell lines={STATIC_LINES} showCursor={false} />;
  }

  return <TerminalLoaderAnimated />;
}
