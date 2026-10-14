import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssemblyProgress } from '../src/scripts/assembly-progress.js';

test('assembly progress remains at the exploded pose before the scroll range', () => {
	assert.equal(getAssemblyProgress(0), 0);
	assert.equal(getAssemblyProgress(0.08), 0);
});

test('assembly progress reaches the assembled pose at the end of its scroll range', () => {
	assert.equal(getAssemblyProgress(0.72), 1);
	assert.equal(getAssemblyProgress(1), 1);
});

test('assembly progress advances smoothly between its start and end', () => {
	assert.ok(getAssemblyProgress(0.4) > 0 && getAssemblyProgress(0.4) < 1);
});
