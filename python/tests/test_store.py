from app import store


def test_add_and_find_round_trips():
    conn = store.connect()
    store.add(conn, "alpha", "first")
    store.add(conn, "beta", "second")

    assert store.count(conn) == 2
    found = store.find_by_title(conn, "alpha")
    assert len(found) == 1
    assert found[0]["body"] == "first"


def test_find_treats_input_as_data_not_sql():
    conn = store.connect()
    store.add(conn, "alpha", "first")

    # A parameterized query returns nothing for this title rather than
    # dropping the table.
    assert store.find_by_title(conn, "alpha' OR '1'='1") == []
    assert store.count(conn) == 1
