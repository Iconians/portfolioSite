import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/app/Components/ui/button";
import { TerminalLoader } from "../TerminalLoader/TerminalLoader";

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
            I&apos;m a passionate full-stack web developer with a strong foundation
            in both modern web technologies and core computer science concepts.
            My journey began as a kid tinkering with MS-DOS just to load a Chip
            &apos;n Dale game — and that spark of curiosity has never left.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
            I build intuitive, high-performance applications and write about
            data structures, algorithms, and problem-solving. From motion-driven
            interfaces to performant backend systems, I create experiences that
            are both functional and engaging.
          </p>
          <div className="flex gap-4 items-center">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/Iconians"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
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
