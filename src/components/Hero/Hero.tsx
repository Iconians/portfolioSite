import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerminalLoader } from "../TerminalLoader/TerminalLoader";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
          <h1 className="text-[40px] font-bold mb-4 text-balance leading-tight">
            Clayton Cripe
          </h1>
          <p className="text-lg text-primary mb-3">
            Full-Stack Engineer
          </p>
          <p className="text-xl font-semibold text-foreground mb-4">
            Building scalable SaaS platforms with a focus on performance and clean architecture.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8 text-pretty">
            I build fast, maintainable web applications designed to scale. My
            work focuses on SSR-first architectures using Next.js, TypeScript,
            and PostgreSQL — building systems that prioritize performance, clean
            boundaries between frontend and backend logic, and long-term
            maintainability.
          </p>
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
                <LinkedInIcon className="h-5 w-5" />
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
      <p className="mt-10 pt-8 border-t border-border text-center text-sm text-muted-foreground md:text-base">
        Recent work includes production SaaS platforms with multi-tenant
        architecture, Stripe subscription billing, and real-time collaboration
        systems.
      </p>
    </section>
  );
}
