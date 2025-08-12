import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

export interface ParsedArticle {
  title: string;
  content: string;
}

export function extractArticle(doc: Document): ParsedArticle | null {
  const reader = new Readability(doc);
  const parsed = reader.parse();
  if (!parsed) return null;
  const clean = DOMPurify.sanitize(parsed.content);
  return { title: parsed.title, content: clean };
}
