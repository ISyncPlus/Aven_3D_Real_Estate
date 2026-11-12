import assert from 'node:assert/strict';
import { readFile, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';
const base = 'http://127.0.0.1:3000';
const date = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
const details = { name: 'Aven API Quality Check', email: 'quality-check@example.com', date, residence: '4A' };
const send = (origin, body = details) => fetch(base + '/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
for (const origin of ['https://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3001']) assert.equal((await send(origin)).status, 403, 'different schemes, hosts and ports must be rejected');
assert.equal((await send(base, { ...details, email: 'invalid' })).status, 400);
assert.equal((await send(base, { ...details, residence: '4C' })).status, 409);
let record;
try {
  const response = await send(base);
  const result = await response.json();
  assert.equal(response.status, 201, JSON.stringify(result));
  assert.match(result.reference, /^AVN-[A-F0-9]{8}$/);
  record = join(process.cwd(), 'data', 'enquiries', result.reference + '.json');
  const saved = JSON.parse(await readFile(record, 'utf8'));
  assert.equal(saved.email, details.email);
  assert.equal(saved.residence, details.residence);
  assert.equal((await stat(record)).mode & 0o077, 0, 'enquiry files must remain private');
  console.log('Viewing API passed: exact origin validation, input validation, availability, private storage, confirmation reference.');
} finally { if (record) await unlink(record); }
