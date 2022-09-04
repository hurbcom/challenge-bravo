from fastapi.testclient import TestClient
import pytest



@pytest.mark.parametrize("source, target, amount, converted_amount, status_code", [
    ("BRL", "EUR", 10, 1.97, 200),
    ("HURB", "TEST", 2, 0.2, 200),
    ("HURB", "BRL", 47.80, 11.95, 200),
    ("HURB", "USD", 23.50, 1.15, 200),
    ("BTC", "USD", 19.27, 385400.0, 200),
    ("EUR", "ETH", 157.76, 0.09, 200),
    ("EUR", "USD", 157.76, 156.2, 200),
])
def test_found_in_db(client: TestClient, source, target, amount, converted_amount, status_code, create_hurb_quote, create_test_quote):
    """
    Try to convert two currencies in db
    """
    res = client.get(f"/convert/?source={source}&target={target}&amount={amount}")
    res_data = res.json()["data"]

    # validate response
    assert res.status_code == status_code
    assert res_data["converted_amount"] == converted_amount
    assert res_data["source"] == source
    assert res_data["target"] == target
    assert res_data["amount"] == amount


@pytest.mark.parametrize("source, target, amount, status_code, missing_currency", [
    ("HURB", "EUR", 2, 404, "HURB"),
    ("HURB", "BRL", 47.80, 404, "HURB"),
    ("BTC", "TEST", 19.27, 404, "TEST"),
    ("NOTFOUND", "ETH", 157.76, 404, "NOTFOUND"),
    ("FICTICIOUS", "USD", 157.76, 404, "FICTICIOUS"),
])
def test_not_found_in_db(client: TestClient, source, target, amount, status_code, missing_currency):
    """
    Try to convert two currencies and one of them is not in db
    """
    res = client.get(f"/convert/?source={source}&target={target}&amount={amount}")

    # validate response
    assert res.status_code == status_code
    assert res.json()["detail"] == f"Currency code {missing_currency} not found"
