'use strict';

const test = require('node:test');
const assert = require('node:assert');
const calc = require('./calc');

test('evaluates a simple expression', () => {
  assert.strictEqual(calc.evaluate('2 * 21'), 42);
});

test('rejects anything that is not "<int> <op> <int>"', () => {
  assert.throws(() => calc.evaluate('process.exit(1)'), /expression must be/);
  assert.throws(() => calc.evaluate('1 + 1; console.log(1)'), /expression must be/);
});
