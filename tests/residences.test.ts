import { test } from 'node:test';
import assert from 'node:assert/strict';
import { residences, unitsOnFloor, availableOnFloor, getResidence } from '../lib/residences.ts';
import { facade } from '../lib/architecture.ts';
import { city } from '../lib/city.ts';
test('all 32 homes have unique IDs and a valid selectable floor', () => {
  assert.equal(new Set(residences.map(unit => unit.id)).size, 32);
  for (let floor = 1; floor <= 8; floor++) {
    assert.equal(unitsOnFloor(floor).length, 4);
    assert.ok(availableOnFloor(floor).length > 0);
    assert.ok(availableOnFloor(floor).every(unit => unit.available && unit.floor === floor));
  }
  assert.equal(getResidence('4B')?.floor, 4);
  assert.equal(getResidence('invalid'), undefined);
  assert.equal(availableOnFloor(0).length, 0);
});
test('architectural instance transforms are finite and have positive dimensions', () => {
  const parts = facade();
  assert.ok(parts.glass.length + parts.warmGlass.length >= 80);
  assert.ok(parts.metal.length > 200);
  for (const batch of Object.values(parts)) for (const part of batch) {
    assert.ok(part.p.every(Number.isFinite));
    assert.ok(part.s.every(n => Number.isFinite(n) && n > 0));
  }
});

test('neighboring architecture includes detailed facades and valid instance transforms', () => {
  const parts = city();
  assert.ok(parts.glass.length > 500);
  assert.ok(parts.brick.length > 0 && parts.plaster.length > 0 && parts.limestone.length > 0);
  assert.ok(parts.railing.length > 0 && parts.roof.length >= 16);
  for (const batch of Object.values(parts)) for (const part of batch) {
    assert.ok(part.p.every(Number.isFinite));
    assert.ok(part.s.every(n => Number.isFinite(n) && n > 0));
  }
});
