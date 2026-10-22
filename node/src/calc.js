'use strict';

// Evaluates a trivial "<int> <op> <int>" expression by parsing it, not by
// handing it to the JS engine. Test case T04 replaces this with eval();
// never merged.

function evaluate(expr) {
  const m = /^\s*(-?\d{1,9})\s*([+\-*])\s*(-?\d{1,9})\s*$/.exec(String(expr));
  if (!m) {
    throw new Error('expression must be "<int> <op> <int>" with op one of + - *');
  }
  const [, left, op, right] = m;
  const a = Number(left);
  const b = Number(right);

  // Switched rather than looked up in a table by key. Indexing an object with
  // a request-derived string is a dynamic call whose target is not visible at
  // the call site, which is what CodeQL's js/unvalidated-dynamic-method-call
  // objects to -- correctly, even though the regex above constrains `op`.
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    default: throw new Error(`unsupported operator: ${op}`);
  }
}

module.exports = { evaluate };
