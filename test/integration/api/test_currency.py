from datetime import datetime
from bson import ObjectId

from exception import REP001

PREFIX = "/api/currency"


def test_valid_create_new_currency(fixture_client, fixture_mongo):
    payload = {}

    res = fixture_client.post(PREFIX, json=payload)
    assert res.status_code == 400
    assert res.json == {
        "error": {
            "code": "GEE005",
            "msg": 'The request payload is invalid: {"isoCode": ["required field"], "name": ["required field"]}',
        },
    }

    payload = {"name": "Brazilian real", "isoCode": "BRL"}

    res = fixture_client.post(PREFIX, json=payload)

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


def test_valid_get_currency(fixture_client, fixture_currency):
    res = fixture_client.get(f"{PREFIX}/{str(ObjectId())}")

    assert res.status_code == 200
    assert res.json == {}

    currency = fixture_currency()

    res = fixture_client.get(f"{PREFIX}/{str(currency.id)}")

    assert res.status_code == 200

    resj = res.json
    assert resj["id"] == str(currency.id)
    assert resj["name"] == currency.name
    assert resj["isoCode"] == currency.iso_code
    assert resj["creationDate"] == currency.creation_date.strftime("%Y-%m-%d %H:%M:%S")
    assert resj["updateDate"] == currency.update_date.strftime("%Y-%m-%d %H:%M:%S")


def test_valid_list_currencies(fixture_client, fixture_currency):
    res = fixture_client.get(PREFIX)

    assert res.status_code == 200
    assert len(res.json["items"]) == 0
    assert res.json["totalItems"] == 0
    assert res.json["nextPage"] is False

    fixture_currency({})
    fixture_currency({"name": "United States dollar", "iso_code": "USD"})
    fixture_currency({"name": "British pound", "iso_code": "GBP"})
    fixture_currency({"name": "Euro", "iso_code": "EUR"})

    res = fixture_client.get(PREFIX)

    assert res.status_code == 200

    resj = res.json
    assert resj["totalItems"] == 4
    assert resj["nextPage"] is False

    items = resj["items"]
    assert len(items) == 4
    assert items[0]["isoCode"] == "BRL"
    assert items[1]["isoCode"] == "EUR"
    assert items[2]["isoCode"] == "GBP"
    assert items[3]["isoCode"] == "USD"

    res = fixture_client.get(
        PREFIX, query_string={"pageNumber": 2, "pageSize": 1, "ordering": "-iso_code"}
    )

    resj = res.json
    assert resj["totalItems"] == 4
    assert resj["nextPage"] is True

    items = resj["items"]
    assert len(items) == 1
    assert items[0]["isoCode"] == "GBP"


def test_valid_update_currency(fixture_client, fixture_mongo, fixture_currency):
    res = fixture_client.put(f"{PREFIX}/{str(ObjectId())}")

    assert res.status_code == 400
    assert res.json["error"] == REP001

    currency = fixture_currency()

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 1
    assert currencies[0]["_id"] == currency.id
    assert currencies[0]["iso_code"] == "BRL"

    res = fixture_client.put(f"{PREFIX}/{str(currency.id)}", json={"isoCode": "BRR"})

    assert res.status_code == 200
    assert res.json["id"] == str(currency.id)
    assert res.json["isoCode"] == "BRR"

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 1


def test_valid_delete_currency(fixture_client, fixture_mongo, fixture_currency):
    res = fixture_client.put(f"{PREFIX}/{str(ObjectId())}")

    assert res.status_code == 400
    assert res.json["error"] == REP001

    currency = fixture_currency()

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 1
    assert currencies[0]["_id"] == currency.id

    res = fixture_client.delete(f"{PREFIX}/{str(currency.id)}")

    assert res.status_code == 204

    currencies = list(fixture_mongo.currency.find({}))
    assert len(currencies) == 0
