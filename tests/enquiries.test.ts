import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from '../lib/enquiries.ts';
const details = { name: ' Aven Visitor ', email: 'visitor@example.com', date: '2026-12-10', residence: '4A' };
test('viewing requests normalize names and accept valid dates and residence IDs', () => {
  const result = validateEnquiry(details, '2026-11-12');
  assert.equal(typeof result, 'object');
  if (typeof result !== 'string') assert.equal(result.name, 'Aven Visitor');
});
test('viewing validation rejects malformed requests and invalid or past dates', () => {
  for (const input of [null, [], {}, { ...details, email: 'invalid' }, { ...details, name: ' ' }, { ...details, date: '2026-02-30' }, { ...details, date: '2026-11-01' }, { ...details, residence: '99Z' }]) assert.equal(typeof validateEnquiry(input, '2026-11-12'), 'string');
});
