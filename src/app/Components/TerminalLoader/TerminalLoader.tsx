"use client";

import { useEffect, useState } from "react";

export function TerminalLoader() {
  const [lines, setLines] = useState<string[]>([]);

  const terminalSequence = [
    { text: "$ initializing portfolio...", delay: 0 },
    { text: "Loading developer profile...", delay: 800 },
    { text: "✓ Skills: React, Next.js, TypeScript, Node.js", delay: 1400 },
    { text: "✓ Passion: Building intuitive web experiences", delay: 2000 },
    { text: "✓ Background: MS-DOS kid turned full-stack dev", delay: 2600 },
    { text: "$ npm run create-awesome-things", delay: 3200 },
    { text: "> Ready to build something amazing! 🚀", delay: 3800 },
  ];

  useEffect(() => {
    terminalSequence.forEach((line, index) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
      }, line.delay);
    });
  }, []);

  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl"></div>
      <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl h-full overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            clayton@portfolio:~
          </span>
        </div>

        {/* Terminal Content */}
        <div className="font-mono text-sm space-y-2">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${
                line.startsWith("✓")
                  ? "text-green-400"
                  : line.startsWith("$")
                  ? "text-primary"
                  : line.startsWith(">")
                  ? "text-accent"
                  : "text-foreground"
              } animate-in fade-in slide-in-from-left-2 duration-300`}
            >
              {line}
            </div>
          ))}
          {lines.length > 0 && lines.length < terminalSequence.length && (
            <div className="inline-block w-2 h-4 bg-primary animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
