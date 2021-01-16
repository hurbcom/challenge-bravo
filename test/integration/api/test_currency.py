from datetime import datetime
from bson import ObjectId


PREFIX = "/api/currency"


def test_invalid_create_new_currency_with_invalid_payload(fixture_client):
    payload = {}

    res = fixture_client.post(PREFIX, json=payload)
    assert res is not None
    assert res.status_code == 400
    assert res.json == {
        "error": {
            "code": "GEE005",
            "msg": 'The request payload is invalid: {"isoCode": ["required field"], "name": ["required field"]}',
        },
    }


def test_valid_create_new_currency(fixture_client, fixture_mongo):
    payload = {"name": "Brazilian real", "isoCode": "BRL"}

    res = fixture_client.post(PREFIX, json=payload)

    assert res is not None
    assert res.status_code == 201
    assert res.json["id"] is not None
    assert res.json["name"] == payload["name"]
    assert res.json["isoCode"] == payload["isoCode"]
    assert res.json["creationDate"] is not None
    assert res.json["updateDate"] is not None

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 1
    assert currencies[0]["name"] == payload["name"]
    assert currencies[0]["iso_code"] == payload["isoCode"]
    assert currencies[0]["creation_date"] is not None
    assert isinstance(currencies[0]["creation_date"], datetime)
    assert currencies[0]["update_date"] is not None
    assert isinstance(currencies[0]["update_date"], datetime)


def test_invalid_get_non_existing_currency(fixture_client):
    res = fixture_client.get(f"{PREFIX}/{str(ObjectId())}")

    assert res is not None
    assert res.status_code == 200
    assert res.json == {}


def test_valid_get_currency(fixture_client, fixture_currency):
    currency = fixture_currency()

    res = fixture_client.get(f"{PREFIX}/{str(currency.id)}")

    assert res is not None
    assert res.status_code == 200

    resj = res.json
    assert resj["id"] == str(currency.id)
    assert resj["name"] == currency.name
    assert resj["isoCode"] == currency.iso_code
    assert resj["creationDate"] == currency.creation_date.strftime("%Y-%m-%d %H:%M:%S")
    assert resj["updateDate"] == currency.update_date.strftime("%Y-%m-%d %H:%M:%S")


def test_valid_list_currencies(fixture_client, fixture_currency):
    fixture_currency({})
    fixture_currency({"name": "United States dollar", "iso_code": "USD"})
    fixture_currency({"name": "British pound", "iso_code": "GBP"})
    fixture_currency({"name": "Euro", "iso_code": "EUR"})

    res = fixture_client.get(PREFIX)

    assert res is not None
    assert res.status_code == 200
    assert len(res.json) == 4

    resj = res.json
    assert resj[0]["isoCode"] == "BRL"
    assert resj[1]["isoCode"] == "EUR"
    assert resj[2]["isoCode"] == "GBP"
    assert resj[3]["isoCode"] == "USD"

    res = fixture_client.get(
        PREFIX, query_string={"pageNumber": 2, "pageSize": 2, "ordering": "-iso_code"}
    )

    assert res is not None
    assert res.status_code == 200
    assert len(res.json) == 2

    resj = res.json
    assert resj[0]["isoCode"] == "EUR"
    assert resj[1]["isoCode"] == "BRL"
