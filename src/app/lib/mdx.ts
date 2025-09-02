import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

interface FrontMatter {
  title: string;
  description: string;
  date: string;
}

const POSTS_PATH = path.join(process.cwd(), "src/app/lib/content/posts");

export const getPostBySlug = async (slug: string) => {
  const fullPath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });

  return {
    frontMatter: data as FrontMatter,
    mdxSource,
  };
};

export const getAllPosts = () => {
  const fileNames = fs
    .readdirSync(POSTS_PATH)
    .filter((name) => name.endsWith(".mdx"));
  return fileNames.map((fileName) => {
    const slug = fileName.replace(".mdx", "").toLowerCase();
    const fullPath = path.join(POSTS_PATH, fileName);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    return { slug, frontMatter: data as FrontMatter };
  });
};
