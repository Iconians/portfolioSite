"use client";

import { isValidElement, type ReactElement, type ReactNode } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { isMdxBlockCode } from "@/lib/articles/mdx-code";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);

const HIGHLIGHT_LANGUAGES = new Set([
  "javascript",
  "js",
  "typescript",
  "ts",
]);

interface MdxCodeBlockProps {
  className?: string;
  children?: ReactNode;
  code?: string;
  language?: string;
  /** Set for `<pre>` wrappers and legacy `AnimatedCode` blocks. */
  forceBlock?: boolean;
}

function flattenChildrenToString(children: ReactNode): string {
  if (
    children === null ||
    children === undefined ||
    typeof children === "boolean"
  ) {
    return "";
  }
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(flattenChildrenToString).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return flattenChildrenToString(children.props.children);
  }
  return "";
}

function extractLanguage(className?: string, language?: string): string | null {
  if (language) {
    return language;
  }
  const match = /language-([\w-]+)/.exec(className ?? "");
  return match?.[1] ?? null;
}

function PlainCodeBlock({ source }: { source: string }) {
  return (
    <div
      className="not-prose my-4 overflow-hidden rounded-lg border border-border bg-[#272822] text-[#f8f8f2]"
      data-slot="mdx-code-block"
    >
      <pre
        className="overflow-x-auto p-4 text-sm leading-relaxed"
        style={{ margin: 0, background: "transparent" }}
      >
        <code
          className="block whitespace-pre-wrap break-words font-mono"
          style={{ overflowWrap: "anywhere" }}
        >
          {source}
        </code>
      </pre>
    </div>
  );
}

function HighlightedCodeBlock({
  source,
  language,
}: {
  source: string;
  language: string;
}) {
  return (
    <div
      className="not-prose my-4 overflow-hidden rounded-lg border border-border bg-[#272822] text-[#f8f8f2]"
      data-slot="mdx-code-block"
    >
      <SyntaxHighlighter
        language={language}
        style={okaidia}
        PreTag="div"
        CodeTag="code"
        useInlineStyles
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          background: "transparent",
          overflowX: "auto",
        }}
        wrapLongLines
        codeTagProps={{
          style: {
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            fontFamily:
              "var(--font-mono, ui-monospace, SFMono-Regular, monospace)",
          },
        }}
      >
        {source}
      </SyntaxHighlighter>
    </div>
  );
}

function MdxCodeBlock({
  className,
  children,
  code,
  language,
  forceBlock = false,
}: MdxCodeBlockProps) {
  const blockLanguage = extractLanguage(className, language);
  const explicitCode = code?.trim();
  const sourceText = flattenChildrenToString(children);

  if (
    forceBlock ||
    explicitCode ||
    blockLanguage ||
    isMdxBlockCode(className) ||
    /\n/.test(sourceText)
  ) {
    const source = (explicitCode ?? sourceText).replace(/\n$/, "");

    if (!source) {
      return null;
    }

    const highlightLanguage =
      blockLanguage && HIGHLIGHT_LANGUAGES.has(blockLanguage)
        ? blockLanguage
        : null;

    if (highlightLanguage) {
      return (
        <HighlightedCodeBlock source={source} language={highlightLanguage} />
      );
    }

    return <PlainCodeBlock source={source} />;
  }

  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground",
        className
      )}
    >
      {children}
    </code>
  );
}

/** MDX maps legacy article component name to the shared code renderer. */
export function AnimatedCode(props: MdxCodeBlockProps) {
  return <MdxCodeBlock forceBlock {...props} />;
}

export function MdxPre({ children }: { children?: ReactNode }) {
  if (isValidElement<MdxCodeBlockProps>(children)) {
    const child = children as ReactElement<MdxCodeBlockProps>;
    return (
      <MdxCodeBlock
        className={child.props.className}
        code={child.props.code}
        language={child.props.language}
        forceBlock
      >
        {child.props.children}
      </MdxCodeBlock>
    );
  }

  return <>{children}</>;
}

export { MdxCodeBlock };
