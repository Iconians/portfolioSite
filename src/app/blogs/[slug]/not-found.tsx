import { Container } from "@/components/layout/Container";
import { SectionBand } from "@/components/layout/SectionBand";
import { Stack } from "@/components/layout/Stack";
import { Navigation } from "@/components/Nav/Navigation";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Link } from "@/components/ui/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navigation />

      <main>
        <SectionBand tone="canvas">
          <Container className="py-16">
            <Stack gap="md" className="mx-auto max-w-lg text-center">
              <Heading level={1}>Article not found</Heading>
              <Text variant="description">
                The article you&apos;re looking for doesn&apos;t exist or may have
                been unpublished.
              </Text>
              <Link href="/blogs" className="text-sm">
                Back to engineering articles
              </Link>
            </Stack>
          </Container>
        </SectionBand>
      </main>

      <SiteFooter />
    </div>
  );
}
