import { notFound } from "next/navigation";

import BlogPostClient from "@/components/BlogPostClient/BlogPostClient";
import { Container } from "@/components/layout/Container";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { SectionBand } from "@/components/layout/SectionBand";
import { Inline, Stack } from "@/components/layout/Stack";
import { Navigation } from "@/components/Nav/Navigation";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Badge } from "@/components/ui/badge";
import { formatReadTime } from "@/lib/articles/read-time";
import { getPostBySlug } from "@/lib/mdx";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontMatter, mdxSource } = post;
  const tags = frontMatter.tags ?? [];

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navigation />

      <main>
        <SectionBand tone="canvas">
          <Container className="py-16">
            <ContentWidth width="article">
              <Stack gap="md" className="mb-10">
                <Heading variant="eyebrow">WRITING</Heading>
                <Heading level={1} className="text-balance">
                  {frontMatter.title}
                </Heading>
                <Inline gap="md" className="flex-wrap items-center text-sm text-muted-foreground">
                  {frontMatter.date ? <span>{frontMatter.date}</span> : null}
                  {frontMatter.readTimeMinutes ? (
                    <>
                      {frontMatter.date ? (
                        <span className="text-border" aria-hidden>·</span>
                      ) : null}
                      <span>{formatReadTime(frontMatter.readTimeMinutes)}</span>
                    </>
                  ) : null}
                </Inline>
                {tags.length > 0 ? (
                  <Inline gap="sm" className="flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </Inline>
                ) : null}
                {frontMatter.description ? (
                  <Text variant="description" className="text-pretty">
                    {frontMatter.description}
                  </Text>
                ) : null}
              </Stack>

              <BlogPostClient frontMatter={frontMatter} mdxSource={mdxSource} />
            </ContentWidth>
          </Container>
        </SectionBand>
      </main>

      <SiteFooter />
    </div>
  );
}
