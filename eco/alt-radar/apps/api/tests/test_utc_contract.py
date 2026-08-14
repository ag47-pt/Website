import datetime

def test_utc_timezone_compliance():
    now = datetime.datetime.now(datetime.timezone.utc)
    assert now.tzinfo is not None
    assert now.tzinfo == datetime.timezone.utc
