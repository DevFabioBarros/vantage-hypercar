import assert from 'node:assert/strict';
import test from 'node:test';
import { getParallaxOffset } from '../src/scripts/parallax.js';

test('keeps an image centered at zero offset', () => {
	assert.equal(getParallaxOffset({ top: 400, height: 200, viewportHeight: 1000 }), 0);
});

test('caps the scroll offset at 24 pixels', () => {
	assert.equal(getParallaxOffset({ top: -100, height: 200, viewportHeight: 200 }), 24);
});

test('returns zero when the image is outside the viewport', () => {
	assert.equal(getParallaxOffset({ top: 1100, height: 100, viewportHeight: 1000 }), 0);
});
