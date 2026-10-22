# gh-security-testbed

**This repository is a test fixture, not a product.** It exists to exercise the
CI security-scanning pipeline maintained in `vestjoe/gh-security-pipeline`: the
pipeline is installed here, deliberate flaws are introduced on short-lived
branches, and the scanners' behaviour is checked against a written test plan.

## What this is not

- Not deployable, and not deployed anywhere.
- No real services, endpoints, or infrastructure. Both apps bind to loopback
  and talk to nothing external.
- **No real credentials.** Nothing in this repository is, was, or resembles a
  working credential. The secret-detection test case uses a `GHSPCANARY-`
  token, which is a made-up string matched by a rule this project wrote for
  that purpose; it authenticates to nothing.
- Not an example of how to structure an application. The code is as small as
  it can be while still giving the scanners something real to parse.

## Layout

```
python/          Flask + SQLite note store, with unit tests
  app/           store.py (parameterized SQL), runner.py (allowlisted
                 subprocess, no shell), server.py (Flask routes)
  tests/         pytest unit tests
  requirements.txt
node/            stdlib HTTP server, no runtime dependencies
  src/           calc.js (parsed arithmetic, no eval), files.js (allowlisted
                 document reads, no path joining), index.js (routes)
  package.json
.github/workflows/security.yml   installed by bootstrap; do not hand-edit
```

`main` is kept clean: it passes the gate with zero blocking findings. That is
what lets the gate run in enforcing mode without a backlog of legacy findings.
Flaws live only on `flaw/*` branches, are never merged, and are deleted after
each test run.

## Running it locally

```bash
# Python
cd python && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt && pytest

# Node
cd node && npm test
```

## Test plan

The cases, the exact flaw each one introduces, and the expected scanner output
live in `docs/TEST-PLAN.md` in `vestjoe/gh-security-pipeline` (private).

<!-- T07: benign change, control case for the security pipeline. -->
