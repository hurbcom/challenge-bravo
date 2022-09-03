from fastapi.testclient import TestClient



def test_found_in_db(client: TestClient, real_currency_data_brl: dict):
    """
    Try to create a currency that already exists in database and asserts an error
    """
    res = client.post("/quote/", json=real_currency_data_brl)
    assert res.status_code == 409
    assert res.json()["detail"] == f"Currency code {real_currency_data_brl['currency_code']} already exists"


def test_not_found_in_db(client: TestClient, fantasy_currency_data_hurb: dict):
    """
    Try to create a currency that do not exist in database and asserts a successful create operation.
    """
    res = client.post("/quote/", json=fantasy_currency_data_hurb)
    assert res.status_code == 201
    assert res.json()["currency_code"] == fantasy_currency_data_hurb['currency_code']
    assert res.json()["rate"] == fantasy_currency_data_hurb['rate']
    assert res.json()["backed_by"] == fantasy_currency_data_hurb['backed_by']


def test_not_found_in_db_alternative_input(client: TestClient, fantasy_currency_data_hurb_alternative_input):
    """
    Try to create a currency that do not exist in database using alternative body and asserts a successful create operation
    """
    payload = fantasy_currency_data_hurb_alternative_input
    res = client.post("/quote/", json=payload)
    assert res.status_code == 201
    assert res.json()["currency_code"] == payload["currency_code"]
    assert res.json()["rate"] == payload["amount"] / payload["backed_currency_amount"]
    assert res.json()["backed_by"] == payload["backed_by"]


def test_missing_required_field_in_body(client: TestClient, fantasy_currency_data_hurb_missing_field_input: dict):
    """
    Try to create currency with missing required field in body and asserts an error
    """
    res = client.post("/quote/", json=fantasy_currency_data_hurb_missing_field_input)
    assert res.status_code == 422
    assert res.json()["detail"][0]["msg"] == "You should provide whether a rate field or an amount and backed_currency_amount fields"


def test_providing_all_fields_in_body(client: TestClient, fantasy_currency_data_hurb_all_fields_input: dict):
    """
    Try to create currency using invalid body with all possible fields provided and asserts an error
    """
    res = client.post("/quote/", json=fantasy_currency_data_hurb_all_fields_input)
    assert res.status_code == 422
    assert res.json()["detail"][0]["msg"] == "You should provide only a rate field or an amount and backed_currency_amount fields"