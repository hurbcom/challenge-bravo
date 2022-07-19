from datetime import datetime
from http import HTTPStatus
from random import randint

from flask.testing import FlaskClient
from pytest import mark


@mark.parametrize("from_currency", ["USD", "BRL", "EUR", "BTC", "ETH"])
@mark.parametrize("to_currency", ["USD", "BRL", "EUR"])
def test_get_conversion_200(
    client: FlaskClient,
    from_currency,
    to_currency,
    colorized,
):
    """
    GIVEN the rout '/api?from={cur1}&to={cur2}&amount={float}'
    WHEN I fetch a requisition
    THEN I get the status code 200
    THEN I get the correct payload response
    """

    path = "/api?from={_from}&to={to}&amount={amount}"

    # response format
    # {
    #   <from_currency>: <amount>,
    #   <to_currency>: float,
    #   "quote_date": "YYYY-MM-DD hh:mm:ss"
    # }
    expected_keys = lambda _from, to: (_from, to, "quote_date")
    expected_types = lambda _from, to: {
        _from: float,
        to: float,
        "quote_date": str,
    }

    path = path.format(
        _from=from_currency,
        to=to_currency,
        amount=randint(1, 10),
    )
    response = client.get(path)

    assert response.status_code == HTTPStatus.OK, colorized(
        f"Not able to convert {from_currency} to {to_currency}"
    )

    json: dict = response.json
    expected = expected_keys(from_currency, to_currency)
    assert set(json) == set(expected), colorized(
        f"{from_currency} - {to_currency} - {path}"
    )

    response_types = expected_types(from_currency, to_currency)

    assert type(json[from_currency]) == response_types[from_currency]
    assert type(json[to_currency]) == response_types[to_currency]
    assert datetime.strptime(json["quote_date"], "%Y-%m-%d %H:%M:%S")


def test_get_conversion_unregistered_currency_404(
    client: FlaskClient, currencies, colorized
):
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

    assert response.status_code == HTTPStatus.NOT_FOUND

    assert set(response.json).issuperset(expected), colorized(response)


@mark.parametrize(
    ("params", "missing"),
    [
        ("from=USD&to=BRL", ["amount"]),
        ("from=USD&amount=BRL", ["to"]),
        ("to=BRL&amount=1", ["from"]),
        ("from=USD", ["to", "amount"]),
        ("to=BRL", ["from", "amount"]),
        ("amount=1", ["from", "to"]),
        ("", ["from", "to", "amount"]),
    ],
)
def test_missing_query_params(client: FlaskClient, params, missing, colorized):
    """
    GIVEN the conversion route
    WHEN I do not inform necessary params
    THEN I received correct error message
    THEN I receive the status code 400
    """

    path = f"/api?{params}"

    expected = {"error": "Missing params.", "missing": missing}

    response = client.get(path)

    assert set(response.json).issuperset(expected), colorized(response.json)

    for key, value in response.json.items():
        assert set(value).issuperset(expected[key]), colorized(response.json)

    assert response.status_code == HTTPStatus.BAD_REQUEST


@mark.parametrize("from_curr", [123, "COIN02", "0.23"])
def test_wrong_from_param_value_types(client, from_curr, colorized):
    """
    GIVEN the conversion route
    WHEN I pass wrong value types to `from` param
    THEN I received correct error message
    THEN I receive the status code 400
    """

    path = f"/api?from={from_curr}&to=EUR&amount=1"

    expected = {
        "error": "Invalid value types.",
        "from": {"expected": "alphabetical", "received": f"{from_curr}"},
    }

    response = client.get(path)

    assert response.json == expected, colorized(response.json)
    assert response.status_code == HTTPStatus.BAD_REQUEST


@mark.parametrize("to_curr", [123, "COIN02", "0.23"])
def test_wrong_to_curr_param_value_types(client, to_curr, colorized):
    """
    GIVEN the conversion route
    WHEN I pass wrong value types to `to` param
    THEN I received correct error message
    THEN I receive the status code 400
    """

    path = f"/api?from=EUR&to={to_curr}&amount=1"

    expected = {
        "error": "Invalid value types.",
        "to": {"expected": "alphabetical", "received": f"{to_curr}"},
    }

    response = client.get(path)

    assert response.json == expected, colorized(response.json)
    assert response.status_code == HTTPStatus.BAD_REQUEST


@mark.parametrize("amount", ["abc", "USD"])
def test_wrong_amount_param_value_types(client, amount, colorized):
    """
    GIVEN the conversion route
    WHEN I pass wrong value types to `to` param
    THEN I received correct error message
    THEN I receive the status code 400
    """

    path = f"/api?from=EUR&to=BRL&amount={amount}"

    expected = {
        "error": "Invalid value types.",
        "amount": {"expected": "floatable", "received": f"{amount}"},
    }

    response = client.get(path)

    assert response.json == expected, colorized(response.json)
    assert response.status_code == HTTPStatus.BAD_REQUEST
