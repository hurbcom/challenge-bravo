from datetime import datetime
from http import HTTPStatus
from random import randint

from flask.testing import FlaskClient


def test_get_conversion_200(client: FlaskClient, currencies):
    """
    GIVEN the rout '/api?from={cur1}&to={cur2}&amount={float}'
    WHEN I fetch a requisition
    THEN I get the correct payload response
    THEN I get the status code 200
    """

    path = "/api?from={_from}&to={to}&amount={amount}"

    # response format
    # {
    # <from_currency>: <amount>,
    # <to_currency>: float,
    # "quote_date": "YYYY-MM-DD hh:mm:ss"
    # }
    expected_keys = lambda _from, to: (_from, to, "quote_date")
    expected_types = lambda _from, to: {
        _from: float,
        to: float,
        "quote_date": str,
    }

    for from_currency in currencies:
        for to_currency in set(currencies).difference((from_currency)):
            path = path.format(
                _from=from_currency,
                to=to_currency,
                amount=randint(1, 10),
            )
            response = client.get(path)

            assert response.status_code == HTTPStatus.OK

            json: dict = response.json
            expected = expected_keys(from_currency, to_currency)
            assert set(json) == set(expected)

            response_types = expected_types(from_currency, to_currency)

            assert type(json[from_currency]) == type(response_types[from_currency])
            assert type(json[to_currency]) == type(response_types[to_currency])
            assert datetime.strptime(json["quote_date"], "%Y-%m-%d %I:%M:%S")


def test_get_conversion_unregistered_currency_404(client: FlaskClient, currencies):
    """
    GIVEN the conversion route
    WHEN I inform non-registered currency
    THEN I receive the correct error message
    THEN I receive the status code 404
    """

    non_registered = "BRLT"

    path = f"/api?from={non_registered}&to=BRL&amount=5"

    expected = {
        "error": f"Currency {non_registered} not registered",
        "curencies": [*currencies],
    }

    response = client.get(path)

    assert response.status_code == HTTPStatus.BAD_REQUEST

    assert set(response.data).issuperset(expected)
