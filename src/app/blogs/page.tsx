import BlogGrid from "@/components/blogWrapper/blogWrapper";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Navigation } from "@/components/Nav/Navigation";
import { Heading } from "@/components/typography/Heading";
import { getAllPosts } from "@/lib/mdx";

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navigation />
      <Container as="main" className="py-16">
        <Section className="py-0">
          <Stack gap="sm" className="mb-12">
            <Heading level={2}>Engineering Articles</Heading>
          </Stack>
          <BlogGrid posts={posts} />
        </Section>
      </Container>
    </div>
  );
}
