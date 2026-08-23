import { Inline } from "@/components/layout/Stack";
import { CONTACT_HREF } from "@/components/Nav/navigationLinks";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

import { TerminalLoader } from "../TerminalLoader/TerminalLoader";

export function Hero() {
  return (
    <div className="py-24 md:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <Heading
            level={1}
            className="mb-4 text-[40px] leading-tight text-balance"
          >
            Clayton Cripe
          </Heading>
          <Text className="mb-3 text-lg font-medium text-ds-accent">
            Senior Full-Stack Engineer
          </Text>
          <Text className="mb-4 text-xl font-semibold text-foreground text-pretty">
            Building software that solves operational problems—from internal
            business systems to production SaaS.
          </Text>
          <Text className="mb-8 text-pretty leading-relaxed text-muted-foreground">
            I design and deliver operational software, SaaS platforms, and
            internal systems—with architecture, workflows, and long-term
            evolution in mind.
          </Text>
          <Inline gap="md" className="flex-wrap gap-4">
            <Button asChild>
              <Link href="/#projects" className="no-underline hover:no-underline">
                View work
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={CONTACT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:no-underline"
              >
                Get in touch
              </a>
            </Button>
          </Inline>
        </div>
        <div className="order-1 md:order-2">
          <TerminalLoader />
        </div>
      </div>
      <Text
        variant="muted"
        className="mt-10 border-t border-border pt-8 text-center md:text-base"
      >
        Recent work includes production SaaS platforms with multi-tenant
        architecture, Stripe subscription billing, and real-time collaboration
        systems.
      </Text>
    </div>
  );
}
