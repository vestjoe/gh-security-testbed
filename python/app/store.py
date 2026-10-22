"""A tiny SQLite-backed note store.

Queries are parameterized. Test case T02 in the pipeline's TEST-PLAN.md
replaces `find_by_title` with a string-formatted version to prove the SAST
jobs catch it; that change is never merged.
"""

from __future__ import annotations

import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS notes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body  TEXT NOT NULL
)
"""


def connect(path: str = ":memory:") -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def add(conn: sqlite3.Connection, title: str, body: str) -> int:
    cur = conn.execute(
        "INSERT INTO notes (title, body) VALUES (?, ?)",
        (title, body),
    )
    conn.commit()
    return int(cur.lastrowid or 0)


def find_by_title(conn: sqlite3.Connection, title: str) -> list[dict[str, object]]:
    """Look a note up by exact title."""
    query = f"SELECT id, title, body FROM notes WHERE title = '{title}'"
    rows = conn.execute(query).fetchall()
    return [dict(row) for row in rows]


def count(conn: sqlite3.Connection) -> int:
    return int(conn.execute("SELECT COUNT(*) FROM notes").fetchone()[0])
