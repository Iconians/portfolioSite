import { describe, expect, test } from "bun:test";
import { serialize } from "next-mdx-remote/serialize";

import {
  isMdxBlockCode,
  normalizeMdxCodeBlocks,
} from "@/lib/articles/mdx-code";
import { serializeArticleMdx } from "@/lib/articles/mdx-serialize";

describe("normalizeMdxCodeBlocks", () => {
  test("converts single-line AnimatedCode template children to fenced code", () => {
    const input = "<AnimatedCode>{`const x = 1;`}</AnimatedCode>";
    const output = normalizeMdxCodeBlocks(input);

    expect(output).toContain("```");
    expect(output).toContain("const x = 1;");
    expect(output.includes("<AnimatedCode>")).toBe(false);
  });

  test("converts multiline AnimatedCode template children to fenced code", () => {
    const input = `<AnimatedCode>
  {\`function foo() {
  return 1;
}\`}
</AnimatedCode>`;
    const output = normalizeMdxCodeBlocks(input);

    expect(output).toContain("function foo()");
    expect(output).toContain("return 1;");
  });

  test("leaves inline code and AnimatedCode code prop unchanged", () => {
    const input =
      "<AnimatedCode code=\"const y = 2;\" />\n<p>Use <code>inline</code></p>";
    const output = normalizeMdxCodeBlocks(input);

    expect(output).toBe(input);
  });
});

describe("serializeArticleMdx", () => {
  test("includes single-line fenced code after normalization", async () => {
    const input = "<AnimatedCode>{`const answer = 42;`}</AnimatedCode>";
    const result = await serializeArticleMdx(input);

    expect(result.compiledSource).toContain("const answer = 42;");
  });

  test("matches raw serialize behavior for fenced blocks", async () => {
    const fence = "```ts\nexport const value = true;\n```";
    const legacyBlock =
      "<AnimatedCode>{`export const value = true;`}</AnimatedCode>";
    const normalized = normalizeMdxCodeBlocks(legacyBlock);
    const [fromHelper, fromFence] = await Promise.all([
      serializeArticleMdx(legacyBlock),
      serialize(fence, { mdxOptions: { development: false } }),
    ]);

    expect(fromHelper.compiledSource).toContain("export const value = true;");
    expect(fromFence.compiledSource).toContain("export const value = true;");
    expect(normalized).toContain("export const value = true;");
  });

  test("normalizes multiline legacy AnimatedCode blocks for compile", async () => {
    const snippet = `<AnimatedCode>
  {\`function binarySearch(arr: number[], needle: number): boolean {
  let lo = 0;
  return false;
}\`}
</AnimatedCode>`;
    const result = await serializeArticleMdx(snippet);

    expect(result.compiledSource).toContain("function binarySearch");
    expect(result.compiledSource).toContain("return false;");
  });
});

describe("isMdxBlockCode", () => {
  test("detects language class names", () => {
    expect(isMdxBlockCode("language-typescript")).toBe(true);
    expect(isMdxBlockCode(undefined)).toBe(false);
  });
});
