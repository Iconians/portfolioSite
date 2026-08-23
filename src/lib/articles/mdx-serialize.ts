import { serialize } from "next-mdx-remote/serialize";

import { normalizeMdxCodeBlocks } from "@/lib/articles/mdx-code";

export async function serializeArticleMdx(content: string) {
  return serialize(normalizeMdxCodeBlocks(content), {
    parseFrontmatter: false,
    mdxOptions: {
      development: false,
    },
  });
}
