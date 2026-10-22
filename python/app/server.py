"""Flask front end over the note store. Local-only; nothing is deployable."""

from __future__ import annotations

from flask import Flask, jsonify, request

from . import runner, store


def create_app() -> Flask:
    app = Flask(__name__)
    conn = store.connect()
    store.add(conn, "hello", "first note")

    @app.get("/health")
    def health():
        return jsonify(status="ok", notes=store.count(conn))

    @app.get("/notes")
    def notes():
        title = request.args.get("title", "")
        return jsonify(results=store.find_by_title(conn, title))

    @app.get("/run/<name>")
    def run(name: str):
        try:
            return jsonify(output=runner.run(name))
        except ValueError:
            # The exception text echoes the caller's input, so it stays in the
            # log rather than the response (CodeQL py/stack-trace-exposure).
            app.logger.warning("rejected unknown command", exc_info=True)
            return jsonify(error="unknown command", allowed=sorted(runner.ALLOWED)), 400

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=8000)
