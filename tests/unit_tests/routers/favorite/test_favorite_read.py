from fastapi.testclient import TestClient
import pytest

from app.schemas.favorite import Favorite


TEST_CURRENCY_CODE_OFICIAL = "BRL"
TEST_CURRENCY_CODE_FANTASY = "HURB"


@pytest.mark.parametrize("index, expected_currency_code, expected_rate, expected_backed_by, expected_currency_type", [
    (0, "BRL", 5.12, "USD", "oficial"),
    (1, "HURB", 4.0, "BRL", "fantasy"),
])
def test_read_all_quotes(client: TestClient, index, expected_currency_code, expected_rate, expected_backed_by, expected_currency_type, create_favorite_oficial, create_favorite_fantasy):
    """
    Try to read all currencies in database
    """
    res = client.get("/favorite")
    assert res.status_code == 200

    res_data = res.json()["data"][index]
    assert res_data["currency_code"] == expected_currency_code
    assert res_data["rate"] == expected_rate
    assert res_data["backed_by"] == expected_backed_by
    assert res_data["currency_type"] == expected_currency_type


def test_oficial_found_in_db(client: TestClient, create_favorite_oficial: Favorite):
    """
    Try to read one oficial currency that exists in db to favorite
    """
    res = client.get(f"/favorite/{create_favorite_oficial.currency_code}")
    assert res.status_code == 200

    favorite_output = Favorite(**res.json()["data"])
    assert favorite_output.currency_code == create_favorite_oficial.currency_code
    assert favorite_output.currency_type == create_favorite_oficial.currency_type


def test_oficial_not_found_in_db(client: TestClient):
    """
    Try to read one oficial currency that do not exists in db to favorite
    """
    res = client.get(f"/favorite/{TEST_CURRENCY_CODE_OFICIAL}")
    assert res.status_code == 404
    assert res.json()["detail"] == f"Currency code {TEST_CURRENCY_CODE_OFICIAL} not found in favorites"


def test_fantasy_found_in_db(client: TestClient, create_favorite_fantasy: Favorite):
    """
    Try to read one fantasy currency that exist in db to favorite
    """
    res = client.get(f"/favorite/{create_favorite_fantasy.currency_code}")
    assert res.status_code == 200

    favorite_output = Favorite(**res.json()["data"])
    assert favorite_output.currency_code == create_favorite_fantasy.currency_code
    assert favorite_output.currency_type == create_favorite_fantasy.currency_type


def test_fantasy_not_found_in_db(client: TestClient):
    """
    Try to read one oficial fantasy that do not exists in db to favorite
    """
    res = client.get(f"/favorite/{TEST_CURRENCY_CODE_FANTASY}")
    assert res.status_code == 404
    assert res.json()["detail"] == f"Currency code {TEST_CURRENCY_CODE_FANTASY} not found in favorites"
