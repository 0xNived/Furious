import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Project Setup & Environment', () => {
  it('should run in modern Node.js ESM mode', () => {
    assert.strictEqual(typeof import.meta.url, 'string');
    assert.ok(import.meta.url.startsWith('file:'));
  });

  it('should load Node test runner correctly', () => {
    assert.strictEqual(typeof describe, 'function');
    assert.strictEqual(typeof it, 'function');
  });
});
