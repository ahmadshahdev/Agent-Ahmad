import path from "path";

export interface MarkdownChunk {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  content: string;
  tokenCountEstimate: number;
}

/**
 * Estimates token count based on standard ~4 chars per token rule of thumb
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Splits markdown content into chunks by header (## / ###), maintaining source file & section metadata.
 * Target chunk size is roughly 300-500 tokens.
 */
export function chunkMarkdown(
  filePath: string,
  content: string
): MarkdownChunk[] {
  const fileName = path.basename(filePath);
  const chunks: MarkdownChunk[] = [];

  // Remove YAML frontmatter if present
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, "").trim();

  // Extract main document title if available (# Document Title)
  const titleMatch = contentWithoutFrontmatter.match(/^#\s+(.+)$/m);
  const docTitle = titleMatch ? titleMatch[1].trim() : fileName;

  // Split content by ## or ### headers
  const headerRegex = /^(#{2,3})\s+(.+)$/gm;
  const sections: { title: string; content: string }[] = [];

  let match: RegExpExecArray | null;

  const matches: { title: string; index: number }[] = [];
  while ((match = headerRegex.exec(contentWithoutFrontmatter)) !== null) {
    matches.push({ title: match[2].trim(), index: match.index });
  }

  if (matches.length === 0) {
    // Single section document
    sections.push({ title: docTitle, content: contentWithoutFrontmatter });
  } else {
    // Header content before first ##
    const preamble = contentWithoutFrontmatter.substring(0, matches[0].index).trim();
    if (preamble) {
      sections.push({ title: docTitle, content: preamble });
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index : contentWithoutFrontmatter.length;
      const sectionText = contentWithoutFrontmatter.substring(start, end).trim();
      
      // Clean leading header line from body if needed, but preserve context in content
      sections.push({
        title: `${docTitle} > ${matches[i].title}`,
        content: sectionText,
      });
    }
  }

  // Process sections into 300-500 token chunks
  let chunkCounter = 1;

  for (const sec of sections) {
    const tokens = estimateTokens(sec.content);

    // If section fits within ~500 tokens (approx 2000 chars), keep as single chunk
    if (tokens <= 550) {
      chunks.push({
        id: `${fileName.replace(/\.md$/, "")}-${chunkCounter++}`,
        sourceFile: fileName,
        sectionTitle: sec.title,
        content: sec.content,
        tokenCountEstimate: tokens,
      });
    } else {
      // Split large sections by paragraphs
      const paragraphs = sec.content.split(/\n\n+/);
      let currentBuffer: string[] = [];
      let currentBufferTokens = 0;

      for (const para of paragraphs) {
        const paraTokens = estimateTokens(para);

        if (currentBufferTokens + paraTokens > 500 && currentBuffer.length > 0) {
          const chunkText = currentBuffer.join("\n\n").trim();
          chunks.push({
            id: `${fileName.replace(/\.md$/, "")}-${chunkCounter++}`,
            sourceFile: fileName,
            sectionTitle: sec.title,
            content: chunkText,
            tokenCountEstimate: estimateTokens(chunkText),
          });
          currentBuffer = [];
          currentBufferTokens = 0;
        }

        currentBuffer.push(para);
        currentBufferTokens += paraTokens;
      }

      if (currentBuffer.length > 0) {
        const chunkText = currentBuffer.join("\n\n").trim();
        chunks.push({
          id: `${fileName.replace(/\.md$/, "")}-${chunkCounter++}`,
          sourceFile: fileName,
          sectionTitle: sec.title,
          content: chunkText,
          tokenCountEstimate: estimateTokens(chunkText),
        });
      }
    }
  }

  return chunks;
}
