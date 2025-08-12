import test from 'node:test';
import assert from 'node:assert/strict';
import { simpleExtract } from '../src/extract.js';

test('extracts title and text', () => {
  const html = '<html><head><title>Sample</title></head><body><p>Hello world</p></body></html>';
  const article = simpleExtract(html);
  assert.equal(article.title, 'Sample');
  assert.equal(article.text, 'Hello world');
});

