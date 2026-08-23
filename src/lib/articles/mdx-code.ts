/**
 * MDX compiler drops expression children on <AnimatedCode>{`...`}</AnimatedCode>.
 * Normalize legacy blocks to fenced code so source survives serialize (prod + dev).
 */

const ANIMATED_CODE_TEMPLATE =
  /<AnimatedCode>\s*\{\s*`([\s\S]*?)`\s*\}\s*<\/AnimatedCode>/g;

/** Legacy AnimatedCode with string `code` prop — unchanged by this pass. */
export function normalizeMdxCodeBlocks(content: string): string {
  return content.replace(ANIMATED_CODE_TEMPLATE, (_, rawCode) =>
    toFencedCodeBlock(rawCode)
  );
}

function toFencedCodeBlock(code: string): string {
  const trimmed = code.replace(/\r\n/g, "\n").replace(/\n$/, "");
  return "\n```\n" + trimmed + "\n```\n";
}

export function isMdxBlockCode(className?: string): boolean {
  return Boolean(className && /language-/.test(className));
}
