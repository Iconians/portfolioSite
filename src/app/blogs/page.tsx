import BlogGrid from "@/components/blogWrapper/blogWrapper";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionBand } from "@/components/layout/SectionBand";
import { Stack } from "@/components/layout/Stack";
import { Navigation } from "@/components/Nav/Navigation";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { getAllPosts } from "@/lib/mdx";

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navigation />

      <main>
        <SectionBand tone="canvas">
          <Container className="py-16">
            <Section className="py-0">
              <Stack gap="sm" className="mb-10">
                <Heading variant="eyebrow">WRITING</Heading>
                <Heading level={1}>Engineering articles</Heading>
                <Text variant="description">
                  Technical writing on algorithms, data structures, migrations,
                  and engineering practice.
                </Text>
                <Text variant="muted" className="text-sm">
                  {posts.length} articles
                </Text>
              </Stack>
              <BlogGrid posts={posts} />
            </Section>
          </Container>
        </SectionBand>
      </main>

      <SiteFooter />
    </div>
  );
}
