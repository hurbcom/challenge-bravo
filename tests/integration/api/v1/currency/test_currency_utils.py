import uuid

import httpx


def get_currency(base_url: str, dolar: str, real: str, amount: str) -> dict:
    url = f"{base_url}?from={dolar}&to={real}&amount={amount}"
    response = httpx.get(url)

    return response.json()


def validate_get_currency_response(response: dict):
    assert "converted_value" in response
    assert type(response["converted_value"]) is str
    value = float(response["converted_value"])
    assert value


def create_currency(base_url: str, acronym: str, name: str) -> dict:
    payload = {"acronym": acronym, "name": name}
    response = httpx.post(base_url, json=payload)

    return response.json()


def validate_create_currency_response(response: dict):
    assert "id" in response
    assert type(response["id"]) is str
    value = uuid.UUID(response["id"])
    assert value
