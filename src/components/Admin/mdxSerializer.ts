// Custom serializer that converts TipTap JSON to MDX with animated components

interface TipTapMark {
  type: string;
}

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: TipTapMark[];
}

interface TipTapDocument extends TipTapNode {
  type: "doc";
  content?: TipTapNode[];
}

export function serializeToMDX(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const doc = content as TipTapDocument;
  if (!doc.content) return "";
  return serializeNode(doc);
}

function serializeNode(node: TipTapNode | string): string {
  if (typeof node === "string") return node;

  if (!node || typeof node !== "object") return "";

  switch (node.type) {
    case "doc":
      return node.content?.map(serializeNode).join("") || "";

    case "paragraph":
      const paragraphText = node.content?.map(serializeNode).join("") || "";
      return `<AnimatedParagraph>\n  ${paragraphText}\n</AnimatedParagraph>\n\n`;

    case "heading":
      const level = node.attrs?.level || 2;
      const headingText = node.content?.map(serializeNode).join("") || "";
      return `<AnimatedHeading level={${level}}>${headingText}</AnimatedHeading>\n\n`;

    case "bulletList":
    case "orderedList":
      const items = node.content?.map(serializeNode).join("") || "";
      return `<AnimatedList>\n${items}</AnimatedList>\n\n`;

    case "listItem":
      const itemText = node.content?.map(serializeNode).join("") || "";
      return `  <AnimatedListItem>${itemText}</AnimatedListItem>\n`;

    case "codeBlock":
      const code = node.content?.[0]?.text || "";
      return `<AnimatedCode>\n  {\`${code
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\`}\n</AnimatedCode>\n\n`;

    case "text":
      let text = node.text || "";
      // Handle marks (bold, italic, etc.)
      if (node.marks) {
        node.marks.forEach((mark: TipTapMark) => {
          if (mark.type === "bold") text = `**${text}**`;
          if (mark.type === "italic") text = `*${text}*`;
          if (mark.type === "code") text = `<code>${text}</code>`;
        });
      }
      return text;

    default:
      // Handle other node types or fallback
      return node.content?.map(serializeNode).join("") || "";
  }
}
