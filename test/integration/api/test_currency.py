from datetime import datetime


PREFIX = "/api/currency"


def test_invalid_add_new_currency_with_invalid_payload(fixture_client):
    payload = {}

    res = fixture_client.post(f"{PREFIX}/add", json=payload)
    assert res is not None
    assert res.status_code == 400
    assert res.json == {
        "error": {
            "code": "GEE005",
            "msg": 'The request payload is invalid: {"isoCode": ["required field"], "name": ["required field"]}',
        },
    }


def test_valid_add_new_currency(fixture_client, fixture_mongo):
    payload = {"name": "Brazilian real", "isoCode": "BRL"}

    res = fixture_client.post(f"{PREFIX}/add", json=payload)

    assert res is not None
    assert res.status_code == 201
    assert res.json["_id"] is not None
    assert res.json["name"] == payload["name"]
    assert res.json["iso_code"] == payload["isoCode"]
    assert res.json["creation_date"] is not None
    assert res.json["update_date"] is not None

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 1
    assert currencies[0]["name"] == payload["name"]
    assert currencies[0]["iso_code"] == payload["isoCode"]
    assert currencies[0]["creation_date"] is not None
    assert isinstance(currencies[0]["creation_date"], datetime)
    assert currencies[0]["update_date"] is not None
    assert isinstance(currencies[0]["update_date"], datetime)
