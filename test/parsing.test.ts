import { describe, expect, it } from 'vitest';
import { extractArticle } from '../src/reader';

describe('extractArticle', () => {
  it('parses simple article', () => {
    const html = `<html><head><title>T</title></head><body><article><h1>Title</h1><p>Hello</p></article></body></html>`;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const result = extractArticle(doc);
    expect(result?.title).toBe('Title');
    expect(result?.content).toContain('Hello');
  });
});
