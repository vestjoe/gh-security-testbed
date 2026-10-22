"""Runs one fixed, allowlisted command.

The argument list form is deliberate: no shell, and the command name is chosen
from a fixed mapping rather than taken from the caller. Test case T03 swaps in
a `shell=True` version; that change is never merged.
"""

from __future__ import annotations

import subprocess

ALLOWED = {
    "version": ["python3", "--version"],
    "date": ["date", "-u", "+%Y-%m-%d"],
}


def run(name: str, timeout: float = 5.0) -> str:
    """Run the allowlisted command `name` and return its stdout."""
    try:
        argv = ALLOWED[name]
    except KeyError:
        raise ValueError(f"unknown command: {name!r}") from None

    completed = subprocess.run(
        argv,
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    return completed.stdout.strip()
