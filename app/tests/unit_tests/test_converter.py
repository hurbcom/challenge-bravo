import pytest
from fastapi.testclient import TestClient


@pytest.mark.parametrize(
    "from_, to, amount, converted_value, status_code",
    [
        ("BRL", "EUR", 10, 1.97, 200),
        ("HURB", "TEST", 2, 0.2, 200),
        ("HURB", "BRL", 47.80, 11.95, 200),
        ("HURB", "USD", 23.50, 1.15, 200),
        ("BTC", "USD", 19.27, 385400.0, 200),
        ("EUR", "ETH", 157.76, 0.09, 200),
        ("EUR", "USD", 157.76, 156.2, 200),
    ],
)
def test_should_convert_currency_from_database(
    client: TestClient,
    from_,
    to,
    amount,
    converted_value,
    status_code,
    create_hurb_currency,
    create_test_currency,
):
    convert_response = client.get(
        f"/converter/?from_={from_}&to={to}&amount={amount}"
    )
    convert_response_data = convert_response.json()["data"]

    assert convert_response.status_code == status_code
    assert convert_response_data["converted_value"] == converted_value
    assert convert_response_data["from_"] == from_
    assert convert_response_data["to"] == to
    assert convert_response_data["amount"] == amount


@pytest.mark.parametrize(
    "from_, to, amount, status_code, missing_currency",
    [
        ("HURB", "EUR", 2, 404, "HURB"),
        ("HURB", "BRL", 47.80, 404, "HURB"),
        ("BTC", "TEST", 19.27, 404, "TEST"),
        ("NOTFOUND", "ETH", 157.76, 404, "NOTFOUND"),
        ("FICTITIOUS", "USD", 157.76, 404, "FICTITIOUS"),
    ],
)
def test_should_not_find_currency_in_database(
    client: TestClient, from_, to, amount, status_code, missing_currency
):
    convert_api_response = client.get(
        f"/converter/?from_={from_}&to={to}&amount={amount}"
    )
    assert convert_api_response.status_code == status_code
    assert (
        convert_api_response.json()["detail"]
        == f"Currency code {missing_currency} not found"
    )