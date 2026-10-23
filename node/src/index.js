'use strict';

// Minimal stdlib HTTP server. Local-only; binds to loopback and talks to
// nothing external.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const calc = require('./calc');
const files = require('./files');

function handle(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const send = (status, body) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  try {
    switch (url.pathname) {
      case '/health':
        return send(200, { status: 'ok' });
      case '/calc':
        return send(200, { result: calc.evaluate(url.searchParams.get('expr') ?? '') });
      case '/docs': {
        // T05b: identical flaw to T05, but the sink sits in this file rather
        // than behind a module boundary.
        const name = url.searchParams.get('name') ?? 'readme.txt';
        const content = fs.readFileSync(path.join(files.DOC_DIR, name), 'utf8');
        return send(200, { content });
      }
      default:
        return send(404, { error: 'not found' });
    }
  } catch (err) {
    return send(400, { error: err.message });
  }
}

const server = http.createServer(handle);

if (require.main === module) {
  server.listen(8080, '127.0.0.1', () => {
    console.log('listening on http://127.0.0.1:8080');
  });
}

module.exports = { handle, server };
