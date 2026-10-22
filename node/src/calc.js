'use strict';

// Evaluates a trivial "<int> <op> <int>" expression by parsing it, not by
// handing it to the JS engine. Test case T04 replaces this with eval();
// never merged.

const OPS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
};

function evaluate(expr) {
  const m = /^\s*(-?\d{1,9})\s*([+\-*])\s*(-?\d{1,9})\s*$/.exec(String(expr));
  if (!m) {
    throw new Error('expression must be "<int> <op> <int>" with op one of + - *');
  }
  const [, left, op, right] = m;
  return OPS[op](Number(left), Number(right));
}

module.exports = { evaluate };
