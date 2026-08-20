import datetime


def test_utc_timezone_compliance():
    now = datetime.datetime.now(datetime.UTC)
    assert now.tzinfo is not None
    assert now.tzinfo == datetime.UTC
