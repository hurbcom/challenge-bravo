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

    if from_currency == to_currency:
        return

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


@mark.parametrize("currency", ["USD", "BRL", "EUR", "BTC", "ETH"])
def test_get_conversion_passing_same_from_and_to_param(
    client: FlaskClient,
    currency,
    colorized,
):
    """
    GIVEN the conversion route
    WHEN I pass same currency to `from` and `to` param
    THEN I receive the correct message
    THEN I receive the status code 200
    """

    path = f"/api?from={currency}&to={currency}&amount=1"
    response = client.get(path)
    json: dict = response.json

    expected = {"message": "Nothing to convert."}

    assert json == expected
    assert response.status_code == HTTPStatus.OK


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
        ("from=USD&amount=1", ["to"]),
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

    missing_fields = {field: ["Missing param."] for field in missing}

    expected = {"error": "Validation error.", **missing_fields}

    response = client.get(path)

    assert set(response.json).issuperset(expected), colorized(response.json)

    for key, value in response.json.items():
        assert set(value).issuperset(expected[key]), colorized(response.json)

    assert response.status_code == HTTPStatus.BAD_REQUEST


@mark.parametrize("amount", ["abc", "USD"])
def test_wrong_amount_param_value_type(client, amount, colorized):
    """
    GIVEN the conversion route
    WHEN I pass wrong value types to `amount` param
    THEN I received correct error message
    THEN I receive the status code 400
    """

    path = f"/api?from=EUR&to=BRL&amount={amount}"

    expected = {
        "error": "Validation error.",
        "amount": ["Not a valid number."],
    }

    response = client.get(path)

    assert response.json == expected, colorized(response.json)
    assert response.status_code == HTTPStatus.BAD_REQUEST
