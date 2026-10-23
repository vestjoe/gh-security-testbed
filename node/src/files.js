'use strict';

// Serves a fixed set of in-repo documents. Lookups go through an allowlist
// rather than through path joining, so a request cannot reach outside it.
// Test case T05 replaces this with an unsanitized path join; never merged.

const fs = require('node:fs');
const path = require('node:path');

const DOC_DIR = path.join(__dirname, '..', 'docs');

const ALLOWED = new Map([
  ['readme', 'readme.txt'],
  ['notes', 'notes.txt'],
]);

function list() {
  return [...ALLOWED.keys()];
}

function read(name) {
  return fs.readFileSync(path.join(DOC_DIR, name), 'utf8');
}

module.exports = { list, read, DOC_DIR };
