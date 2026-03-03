import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/app/Components/ui/button";
import { TerminalLoader } from "../TerminalLoader/TerminalLoader";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.22 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32 max-w-7xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Clayton Cripe
          </h1>
          <p className="text-xl md:text-2xl text-primary mb-4">
            Full-Stack Web Developer
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-pretty">
            I build performance-focused web applications with Next.js,
            TypeScript, and PostgreSQL — emphasizing clean architecture,
            SSR-first design, and scalable backend systems. From multi-tenant
            SaaS platforms to polished client projects, I focus on shipping
            software that is fast, maintainable, and built to grow.
          </p>
          {/* <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
            I build intuitive, high-performance applications and write about
            data structures, algorithms, and problem-solving. From motion-driven
            interfaces to performant backend systems, I create experiences that
            are both functional and engaging.
          </p> */}
          <div className="flex gap-4 items-center">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/Iconians"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://linkedin.com/in/claytoncripe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="mailto:claytoncripe@gmail.com" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <TerminalLoader />
        </div>
      </div>
    </section>
  );
}
