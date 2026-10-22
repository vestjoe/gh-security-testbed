import pytest

from app import runner


def test_runs_an_allowlisted_command():
    assert runner.run("date")


def test_rejects_anything_not_allowlisted():
    with pytest.raises(ValueError):
        runner.run("date; echo pwned")
