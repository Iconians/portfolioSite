import { Container } from "@/components/layout/Container";
import { Inline, Stack } from "@/components/layout/Stack";
import {
  CONTACT_HREF,
  navigationLinks,
} from "@/components/Nav/navigationLinks";
import { Text } from "@/components/typography/Text";
import { Link } from "@/components/ui/link";

const socialLinks = [
  {
    href: "https://github.com/Iconians",
    label: "GitHub",
  },
  {
    href: CONTACT_HREF,
    label: "LinkedIn",
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-footer">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <Stack gap="sm">
            <Link href="/" className="text-base font-semibold text-foreground no-underline">
              <span className="text-ds-accent">&gt;</span> Clayton Cripe
            </Link>
            <Text variant="muted" className="text-sm">
              Engineering Portfolio Platform
            </Text>
            <Text variant="muted" className="text-sm">
              © {year} Clayton Cripe
            </Text>
          </Stack>

          <Stack gap="md">
            <nav aria-label="Footer">
              <Inline gap="md" className="flex-wrap">
                {navigationLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-muted-foreground no-underline hover:text-ds-accent-hover"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href={CONTACT_HREF}
                  external
                  className="text-sm text-muted-foreground no-underline hover:text-ds-accent-hover"
                >
                  Get in touch
                </Link>
              </Inline>
            </nav>
            <Inline gap="md" className="flex-wrap">
              {socialLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  external
                  className="text-sm text-muted-foreground no-underline hover:text-ds-accent-hover"
                >
                  {label}
                </Link>
              ))}
            </Inline>
          </Stack>
        </div>
      </Container>
    </footer>
  );
}
